import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleBanUser } from "../lib/api";

const useBanUser = () => {
  const queryClient = useQueryClient();

  const { mutate: banUser, isPending, error } = useMutation({
    mutationFn: toggleBanUser,
    onSuccess: () => {
      // refresh banned users list after success
      queryClient.invalidateQueries({ queryKey: ["bannedUsers"] });
    },
  });

  return { banUser, isPending, error };
};

export default useBanUser;
