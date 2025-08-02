
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { generateCV, getCV, updateCV, deleteCV } from '../lib/api';

// // Generate CV
// export const useGenerateCV = () => {
//   const queryClient = useQueryClient();

//   const { mutate, isPending, error } = useMutation({
//     mutationFn: generateCV,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv'] }),
//     onError: (error) => {
//       console.error('Generate CV Error:', error.response?.data || error.message);
//     },
//   });

//   return { generateCVMutation: mutate, isPending, error };
// };

// // Get CV
// export const useGetCV = (userId) => {
//   console.log("Fetching CVs for user:", userId);

//   const {
//     data: cv,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ['cv', userId],
//     queryFn: () => getCV(userId),
//     enabled: !!userId,
//   });

//   if (isError) {
//     console.error("Error fetching CVs:", error);
//   }

//   return { cv, isLoading, isError, error };
// };




// // ✅ Add this — Update CV
// export const useUpdateCV = () => {
//   const queryClient = useQueryClient();

//   const { mutate, isPending, error } = useMutation({
//     mutationFn: updateCV,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv'] }),
//     onError: (error) => {
//       console.error('Update CV Error:', error.response?.data || error.message);
//     },
//   });

//   return { updateCVMutation: mutate, isPending, error };
// };

// // ✅ Add this — Delete CV
// export const useDeleteCV = () => {
//   const queryClient = useQueryClient();

//   const { mutate, isPending, error } = useMutation({
//     mutationFn: deleteCV,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv'] }),
//     onError: (error) => {
//       console.error('Delete CV Error:', error.response?.data || error.message);
//     },
//   });

//   return { deleteCVMutation: mutate, isPending, error };
// };









import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { generateCV, getCV, updateCV, deleteCV } from "../lib/api"

// Generate CV
export const useGenerateCV = () => {
  const queryClient = useQueryClient()
  const { mutate, isPending, error } = useMutation({
    mutationFn: generateCV,
    onSuccess: (data) => {
      // Directly update the cache with the newly generated CV
      queryClient.setQueryData(["cv", data.userId || data.user], (oldData) => {
        const newCV = data // generateCV returns the full CV object
        if (oldData) {
          // Agar pehle se CVs hain, toh naya CV add karein
          return [...oldData, newCV]
        }
        // Agar koi CV nahi hai, toh naya CV array mein return karein
        return [newCV]
      })
    },
    onError: (error) => {
      console.error("Generate CV Error:", error.response?.data || error.message)
    },
  })
  return { generateCVMutation: mutate, isPending, error }
}

// Get CV
export const useGetCV = (userId) => {
  console.log("Fetching CVs for user:", userId)
  const {
    data: cv,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cv", userId],
    queryFn: () => getCV(userId),
    enabled: !!userId,
  })
  if (isError) {
    console.error("Error fetching CVs:", error)
  }
  return { cv, isLoading, isError, error }
}

// Update CV
export const useUpdateCV = () => {
  const queryClient = useQueryClient()
  const { mutate, isPending, error } = useMutation({
    mutationFn: updateCV,
    onSuccess: (data) => {
      // Directly update the cache for the specific updated CV
      queryClient.setQueryData(["cv", data.userId || data.user], (oldData) => {
        if (oldData) {
          return oldData.map((cv) => (cv._id === data._id ? data : cv))
        }
        return oldData
      })
    },
    onError: (error) => {
      console.error("Update CV Error:", error.response?.data || error.message)
    },
  })
  return { updateCVMutation: mutate, isPending, error }
}

// Delete CV
export const useDeleteCV = () => {
  const queryClient = useQueryClient()
  const { mutate, isPending, error } = useMutation({
    mutationFn: deleteCV,
    onSuccess: (data, variables) => {
      // variables mein deleteCV ko pass kiya gaya cvId hoga
      // Cache se deleted CV ko remove karein
      queryClient.setQueryData(["cv", variables.userId || variables.user], (oldData) => {
        if (oldData) {
          return oldData.filter((cv) => cv._id !== variables.cvId)
        }
        return oldData
      })
    },
    onError: (error) => {
      console.error("Delete CV Error:", error.response?.data || error.message)
    },
  })
  return { deleteCVMutation: mutate, isPending, error }
}
