// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   togglePostLike,
//   toggleCommentLike,
//   addComment,
//   addReply,
// } from "../lib/api/";

//     export const useAddComment = (postId) => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (text) => addComment(postId, text),
//         onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ["post", postId] });
//         },
//         onError: (err) => {
//         console.error("Add Comment Error:", err);
//         },
//     });
//     };

// export const useAddReply = (postId, commentId) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (text) => addReply(postId, commentId, text),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["post", postId] });
//     },
//     onError: (err) => {
//       console.error("Add Reply Error:", err);
//     },
//   });
// };

// export const useTogglePostLike = (postId) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: () => togglePostLike(postId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["post", postId] });
//     },
//   });
// };

// export const useToggleCommentLike = (postId, commentId) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: () => toggleCommentLike(postId, commentId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["post", postId] });
//     },
//   });
// };




// hooks/usePostActions.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  togglePostLike,
 
} from "../lib/api";


export const useTogglePostLike = (postId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => togglePostLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
};
