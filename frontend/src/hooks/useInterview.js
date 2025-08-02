// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import {
//   createInterview,
//   getInterviews,
//   startInterview,
//   endInterview,
//   submitAnswer,
//   getInterviewResults,
//   getUserResults,
//   deleteUserResults,
// } from "../lib/api"


// // Hook for creating interviews
// export const useCreateInterview = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn:  createInterview,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["interviews"] })
//     },
//   })
// }

// // Hook for getting interviews
// export const useGetInterviews = (userId) => {
//   return useQuery({
//     queryKey: ["interviews", userId],
//     queryFn: () => getInterviews(userId),
//     enabled: !!userId,
//   })
// }

// // Hook for starting interviews
// export const useStartInterview = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: startInterview,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["interviews"] })
//     },
//   })
// }

// // Hook for ending interviews
// export const useEndInterview = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: endInterview,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["interviews"] })
//     },
//   })
// }

// // Hook for submitting answers
// export const useSubmitAnswer = () => {
//   return useMutation({
//     mutationFn: submitAnswer,
//   })
// }

// // Hook for getting results
// export const useGetResults = (id) => {
//   return useQuery({
//     queryKey: ["results", id],
//     queryFn: () => getInterviewResults(id),
//     enabled: !!id,
//   })
// }

// // Hook for getting all results by user
// export const useGetAllResults = (userId) => {
//   return useQuery({
//     queryKey: ["allResults", userId],
//     queryFn: () => getUserResults(userId), // <-- use correct function
//     enabled: !!userId,
//   })
// }

// export const useDeleteUserResults = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (resultId) => deleteUserResults(resultId),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["allResults"]); // refetch updated data
//     },
//   });
// };















import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createInterview,
  getInterviews,
  startInterview,
  endInterview,
  submitAnswer,
  getInterviewResults,
  getUserResults,
  deleteUserResults,
  deleteInterview, // Import the new deleteInterview API function
} from "../lib/api"

// Hook for creating interviews
export const useCreateInterview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] })
    },
    onError: (error) => {
      console.error("Create Interview Error:", error.response?.data || error.message)
    },
  })
}

// Hook for getting interviews
export const useGetInterviews = (userId) => {
  return useQuery({
    queryKey: ["interviews", userId],
    queryFn: () => getInterviews(userId),
    enabled: !!userId,
  })
}

// Hook for starting interviews
export const useStartInterview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: startInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] })
    },
    onError: (error) => {
      console.error("Start Interview Error:", error.response?.data || error.message)
    },
  })
}

// Hook for ending interviews
export const useEndInterview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: endInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] })
    },
    onError: (error) => {
      console.error("End Interview Error:", error.response?.data || error.message)
    },
  })
}

// Hook for submitting answers
export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: submitAnswer,
    onError: (error) => {
      console.error("Submit Answer Error:", error.response?.data || error.message)
    },
  })
}

// Hook for getting results
export const useGetResults = (id) => {
  return useQuery({
    queryKey: ["results", id],
    queryFn: () => getInterviewResults(id),
    enabled: !!id,
  })
}

// Hook for getting all results by user
export const useGetAllResults = (userId) => {
  return useQuery({
    queryKey: ["allResults", userId],
    queryFn: () => getUserResults(userId), // <-- use correct function
    enabled: !!userId,
  })
}

export const useDeleteUserResults = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (resultId) => deleteUserResults(resultId),
    onSuccess: () => {
      queryClient.invalidateQueries(["allResults"]) // refetch updated data
    },
  })
}

// New: Hook for deleting interviews
export const useDeleteInterview = () => {
  const queryClient = useQueryClient()
  const { mutate, isPending, error } = useMutation({
    mutationFn: deleteInterview,
    onSuccess: (data, interviewId) => {
      // interviewId yahan variables se aayega
      // Cache se deleted interview ko remove karein
      queryClient.setQueryData(["interviews", data.userId || data.user], (oldData) => {
        // Ensure oldData is an object with a 'data' property that is an array
        if (oldData && oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.filter((interview) => interview._id !== interviewId),
          }
        }
        // Agar oldData ka structure expected nahi hai, toh invalidate kar dein
        queryClient.invalidateQueries({ queryKey: ["interviews"] })
        return oldData
      })
    },
    onError: (error) => {
      console.error("Delete Interview Error:", error.response?.data || error.message)
    },
  })
  return { deleteInterviewMutation: mutate, isPending, error }
}
