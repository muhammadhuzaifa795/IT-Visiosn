import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addViewToPost, getPostViews } from "../lib/api";

const usePostViews = (postId) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["postViews", postId],
    queryFn: () => getPostViews(postId),
    enabled: !!postId,
  });

  const { mutate: addView, isPending: isAdding } = useMutation({
    mutationFn: () => addViewToPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postViews", postId] });
    },
  });

  return {
    views: data?.views || [],
    viewsCount: data?.viewsCount || 0,
    isLoading,
    error,
    addView,
    isAdding,
  };
};

export default usePostViews;
