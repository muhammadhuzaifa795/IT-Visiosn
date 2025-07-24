import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../lib/api";

const usePost = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    }
  });

  return { isPending, error, postMutation: mutate };
};

export default usePost;
