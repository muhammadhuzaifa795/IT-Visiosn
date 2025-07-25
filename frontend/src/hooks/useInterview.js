import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createInterview,
  getInterviews,
  startInterview,
  endInterview,
  submitAnswer,
  getInterviewResults,
  getUserResults,
} from "../lib/api"


// Hook for creating interviews
export const useCreateInterview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:  createInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] })
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
  })
}

// Hook for submitting answers
export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: submitAnswer,
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
