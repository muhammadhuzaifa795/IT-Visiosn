// src/hooks/useChatbot.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createChatbotMessage, getChatById, getUserChats } from "../lib/api";
import useAuthUser from './useAuthUser';

const useChatbot = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const createChatbotMutation = useMutation({
    mutationFn: createChatbotMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userChats', authUser?._id] });
    },
  });

  const getUserChatsQuery = useQuery({
    queryKey: ['userChats', authUser?._id],
    queryFn: () => getUserChats(authUser?._id),
    enabled: !!authUser?._id,
    onError: (error) => {
      if (error.response?.status === 404) {
        console.log('No chats found for this user');
        return { chats: [] };
      } else {
        console.error('Error fetching user chats:', error);
      }
    },
  });

  const getChatByIdQuery = (chatId) => useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId,
    onError: (error) => {
      if (error.response?.status === 404) {
        console.log('Chat not found');
      } else {
        console.error('Error fetching chat:', error);
      }
    },
  });

  return {
    createChatbotMutation,
    getUserChatsQuery,
    getChatByIdQuery,
    userId: authUser?._id,
  };
};
export default useChatbot;