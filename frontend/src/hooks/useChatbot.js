import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createChatbotMessage, getChatById, getUserChats, updateChatTitle, deleteChat } from '../lib/api';
import useAuthUser from './useAuthUser';

const useChatbot = () => {
  const queryClient = useQueryClient();
  const { authUser, isLoading: isAuthLoading } = useAuthUser();

  const createChatbotMutation = useMutation({
    mutationFn: createChatbotMessage,
    onSuccess: () => {
      if (authUser?._id) {
        queryClient.invalidateQueries({ queryKey: ['userChats', authUser._id] });
      }
    },
  });

  const updateChatTitleMutation = useMutation({
    mutationFn: ({ chatId, title }) => updateChatTitle(chatId, title),
    onSuccess: () => {
      if (authUser?._id) {
        queryClient.invalidateQueries({ queryKey: ['userChats', authUser._id] });
      }
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      if (authUser?._id) {
        queryClient.invalidateQueries({ queryKey: ['userChats', authUser._id] });
      }
    },
  });

  const getUserChatsQuery = useQuery({
    queryKey: ['userChats', authUser?._id],
    queryFn: () => getUserChats(authUser._id),
    enabled: !!authUser?._id && !isAuthLoading,
    retry: (failureCount, error) => {
      if (error.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    select: (data) => {
      if (!data?.chats) {
        return { chats: [] };
      }
      return data;
    },
  });

  const getChatByIdQuery = (chatId) =>
    useQuery({
      queryKey: ['chat', chatId],
      queryFn: () => getChatById(chatId),
      enabled: !!chatId && !!authUser?._id && !isAuthLoading,
      retry: (failureCount, error) => {
        if (error.response?.status === 404) {
          return false;
        }
        return failureCount < 3;
      },
    });

  return {
    createChatbotMutation,
    updateChatTitleMutation,
    deleteChatMutation,
    getUserChatsQuery,
    getChatByIdQuery,
    userId: authUser?._id,
    isAuthLoading,
  };
};

export default useChatbot;