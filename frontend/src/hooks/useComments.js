import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addComment,
  getCommentsByPost,
  toggleCommentLike,
} from '../lib/api';

export const useComments = (postId) =>
  useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsByPost(postId),
  });

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleCommentLike,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
};
