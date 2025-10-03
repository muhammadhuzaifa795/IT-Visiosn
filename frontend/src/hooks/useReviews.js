import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addReview, getReviews, deleteReview } from "../lib/api";

// Fetch all reviews
export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });
};

// Add Review Mutation
export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]); // refresh after add
    },
  });
};

// Delete Review Mutation
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]); // refresh after delete
    },
  });
};
