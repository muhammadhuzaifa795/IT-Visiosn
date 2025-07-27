import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send as SendIcon, 
  MessageCircle as MessageCircleIcon, 
  Plus as PlusIcon,
  Trash as TrashIcon, 
  Bot as BotIcon, 
  User as UserIcon, 
  Moon as MoonIcon, 
  Sun as SunIcon 
} from 'lucide-react';
import useChatbot from '../hooks/useChatbot';
import { useParams, useNavigate } from 'react-router';
import { generateChatTitle, formatTimestamp } from '../utils/chatUtils';
import MessageContent from '../components/chatbot/MessageContent';
import TypingIndicator from '../components/chatbot/TypingIndicator';

const ChatbotPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { 
    createChatbotMutation, 
    getUserChatsQuery, 
    getChatByIdQuery, 
    deleteChatMutation,
    userId,
    isAuthLoading
  } = useChatbot();
  
  const [message, setMessage] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(chatId || null);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const { data: chatData, isLoading: isChatLoading, error: chatError } = selectedChatId 
    ? getChatByIdQuery(selectedChatId) 
    : { data: null, isLoading: false, error: null };
    
  const { data: userChatsData, isLoading: isUserChatsLoading } = getUserChatsQuery;

  // Handle loading state
  if (isAuthLoading || !userId) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  useEffect(() => {
    if (chatContainerRef.current && chatData?.chat?.messages) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatData?.chat?.messages?.length, streamingMessageId]);

  useEffect(() => {
    if (chatId && chatId !== selectedChatId) {
      setSelectedChatId(chatId);
    }
  }, [chatId, selectedChatId]);

  useEffect(() => {
    if (chatError?.response?.status === 404) {
      navigate('/chatbot');
    }
  }, [chatError, navigate]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || createChatbotMutation.isLoading || !userId) return;

    const currentMessage = message.trim();
    setMessage('');
    setIsTyping(true);

    try {
      const response = await createChatbotMutation.mutateAsync({ 
        userId, 
        message: currentMessage 
      });
      
      setSelectedChatId(response.chatId);
      navigate(`/chatbot/${response.chatId}`);
      
      const lastMessage = response.newMessage || response.assistantResponse;
      if (lastMessage) {
        setStreamingMessageId(response.chatId + '-latest');
        setTimeout(() => {
          setStreamingMessageId(null);
        }, lastMessage.content.length * 20 + 1000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
    navigate(`/chatbot/${chatId}`);
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    navigate('/chatbot');
    setMessage('');
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChatMutation.mutateAsync(chatId);
        if (selectedChatId === chatId) {
          handleNewChat();
        }
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      <aside className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chat History
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? (
                  <SunIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <MoonIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={handleNewChat}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm font-medium">New Chat</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isUserChatsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : userChatsData?.chats?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
              <MessageCircleIcon className="w-8 h-8 mb-2" />
              <p className="text-sm">No chats found</p>
              <p className="text-xs">Start a new conversation!</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {userChatsData?.chats?.map((chat) => (
                <motion.div
                  key={chat.chatId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChatId === chat.chatId
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleChatSelect(chat.chatId)}
                >
                  <MessageCircleIcon className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chat.title || generateChatTitle(chat.firstMessage)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(chat.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(chat.chatId, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
                  >
                    <TrashIcon className="w-3 h-3 text-red-500" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </aside>
      <main className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BotIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Assistant
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                How can I help you today?
              </p>
            </div>
          </div>
        </div>
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
        >
          {isChatLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : selectedChatId && chatData?.chat ? (
            <AnimatePresence>
              {chatData.chat.messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-3xl ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {msg.role === 'user' ? (
                        <UserIcon className="w-4 h-4 text-white" />
                      ) : (
                        <BotIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      )}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                    }`}>
                      <MessageContent
                        content={msg.content}
                        isStreaming={streamingMessageId === selectedChatId + '-latest' && index === chatData.chat.messages.length - 1}
                      />
                      <div className={`text-xs mt-2 ${
                        msg.role === 'user' 
                          ? 'text-blue-100' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTimestamp(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                <BotIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Welcome to AI Assistant
              </h3>
              <p className="text-center max-w-md">
                Start a conversation by typing a message below. I can help you with coding, 
                questions, creative writing, and much more!
              </p>
            </div>
          )}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <BotIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </div>
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <form onSubmit={handleSendMessage} className="relative">
            <div className="flex items-end space-x-3">
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  rows={1}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl 
                           bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white 
                           placeholder-gray-500 dark:placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           resize-none max-h-32 overflow-y-auto"
                />
                <button
                  type="submit"
                  disabled={createChatbotMutation.isLoading || !message.trim() || !userId}
                  className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg
                           hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
                >
                  {createChatbotMutation.isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <SendIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatbotPage;