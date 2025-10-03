// hooks/useJarvis.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { askJarvis, getJarvisConversations,deleteConversation  } from "../lib/api";

// Hook to ask Jarvis
export const useAskJarvis = () => {
  return useMutation({
    mutationFn: askJarvis,
    onError: (err) => {
      console.error("AskJarvis mutation error:", err.message);
    },
  });
};

// Hook to fetch conversation history
export const useConversations = () => {
  return useQuery({
    queryKey: ["jarvisConversations"],
    queryFn: getJarvisConversations,
    onError: (err) => {
      console.error("Get conversations error:", err.message);
    },
  });
};


export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]); // refetch list
    },
    onError: (err) => {
      console.error("Delete error:", err.message);
    },
  });
};