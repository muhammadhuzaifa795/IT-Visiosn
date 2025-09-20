import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserToLeaderboard, getLeaderboardData } from "../lib/api";

const useLeaderboard = () => {
  const queryClient = useQueryClient();

  // Fetch leaderboard data
  const { data, isLoading: isFetching, error: fetchError } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboardData,
  });

  // Add a user to the leaderboard
  const { mutate: addUserMutation, isPending: isAddingUser, error: addUserError } = useMutation({
    mutationFn: ({ userId, ticketId }) => addUserToLeaderboard(userId, ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });

  return {
    leaderboard: data?.leaderboard || [],
    isFetching,
    fetchError,
    addUserToLeaderboard: addUserMutation,
    isAddingUser,
    addUserError,
  };
};

export default useLeaderboard;
