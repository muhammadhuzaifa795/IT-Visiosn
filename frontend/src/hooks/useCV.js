
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateCV, getCV, updateCV, deleteCV } from '../lib/api';

// Generate CV
export const useGenerateCV = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: generateCV,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv'] }),
    onError: (error) => {
      console.error('Generate CV Error:', error.response?.data || error.message);
    },
  });

  return { generateCVMutation: mutate, isPending, error };
};

// Get CV
export const useGetCV = (userId) => {
  console.log("Fetching CVs for user:", userId);

  const {
    data: cv,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['cv', userId],
    queryFn: () => getCV(userId),
    enabled: !!userId,
  });

  if (isError) {
    console.error("Error fetching CVs:", error);
  }

  return { cv, isLoading, isError, error };
};




// ✅ Add this — Update CV
export const useUpdateCV = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: updateCV,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv'] }),
    onError: (error) => {
      console.error('Update CV Error:', error.response?.data || error.message);
    },
  });

  return { updateCVMutation: mutate, isPending, error };
};

// ✅ Add this — Delete CV
export const useDeleteCV = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: deleteCV,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cv'] }),
    onError: (error) => {
      console.error('Delete CV Error:', error.response?.data || error.message);
    },
  });

  return { deleteCVMutation: mutate, isPending, error };
};







