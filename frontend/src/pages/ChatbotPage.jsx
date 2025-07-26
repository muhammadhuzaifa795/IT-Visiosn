// src/pages/ChatbotPage.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SendIcon, MessageCircleIcon, XIcon } from "lucide-react";
import useChatbot from "../hooks/useChatbot";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router";

const ChatbotPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { createChatbotMutation, getUserChatsQuery, getChatByIdQuery, userId } = useChatbot();
  const [message, setMessage] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(chatId || null);
  const chatContainerRef = useRef(null);

  const { data: chatData, isLoading: isChatLoading, error: chatError } = selectedChatId ? getChatByIdQuery(selectedChatId) : { data: null, isLoading: false, error: null };
  const { data: userChatsData, isLoading: isUserChatsLoading } = getUserChatsQuery;

  useEffect(() => {
    if (chatId && chatId !== selectedChatId) {
      setSelectedChatId(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    if (chatContainerRef.current && chatData?.chat?.messages) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatData?.chat?.messages?.length]);

  useEffect(() => {
    if (chatError?.response?.status === 404) {
      navigate("/chatbot");
      toast.error("Chat not found", {
        duration: 2000,
        position: "top-right",
        style: { background: "#fef2f2", color: "#dc2626", borderRadius: "8px", padding: "12px" },
      });
    }
  }, [chatError, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message", {
        duration: 2000,
        position: "top-right",
        style: { background: "#fef2f2", color: "#dc2626", borderRadius: "8px", padding: "12px" },
      });
      return;
    }

    try {
      const response = await createChatbotMutation.mutateAsync({ userId, message });
      setMessage("");
      setSelectedChatId(response.chatId);
      navigate(`/chatbot/${response.chatId}`);
      toast.success("Message sent!", {
        duration: 2000,
        position: "top-right",
        style: { background: "#eff6ff", color: "#2563eb", borderRadius: "8px", padding: "12px" },
      });
    } catch (error) {
      toast.error("Failed to send message", {
        duration: 2000,
        position: "top-right",
        style: { background: "#fef2f2", color: "#dc2626", borderRadius: "8px", padding: "12px" },
      });
    }
  };

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
    navigate(`/chatbot/${chatId}`);
  };

  return (
    <div className="flex h-screen bg-base-100">
      <aside className="w-80 bg-base-200 border-r border-base-300 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary">Chat History</h2>
          <button
            onClick={() => {
              setSelectedChatId(null);
              navigate("/chatbot");
            }}
            className="btn btn-ghost btn-circle"
            aria-label="Clear selected chat"
          >
            <XIcon className="size-5 text-base-content" />
          </button>
        </div>
        {isUserChatsLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : userChatsData?.chats?.length === 0 ? (
          <div className="text-center text-base-content/60">
            <MessageCircleIcon className="size-12 mx-auto mb-2" />
            <p>No chats found. Start a new conversation!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {userChatsData?.chats?.map((chat) => (
              <motion.button
                key={chat.chatId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChatSelect(chat.chatId)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedChatId === chat.chatId ? "bg-primary text-white" : "hover:bg-base-300"
                }`}
              >
                <p className="text-sm font-medium truncate">{chat.firstMessage}</p>
                <p className="text-xs text-base-content/60">
                  {new Date(chat.createdAt).toLocaleString()}
                </p>
              </motion.button>
            ))}
          </div>
        )}
      </aside>
      <main className="flex-1 flex flex-col">
        <div className="p-4 border-b border-base-300 bg-gradient-to-r from-primary/10 to-secondary/10">
          <h1 className="text-2xl font-bold text-primary">Chatbot</h1>
        </div>
        <div
          ref={chatContainerRef}
          className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-300"
        >
          {isChatLoading ? (
            <div className="flex justify-center items-center h-full">
              <span className="loading loading-spinner text-primary"></span>
            </div>
          ) : selectedChatId && chatData?.chat ? (
            <div className="space-y-4">
              {chatData.chat.messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.role === "user" ? "bg-primary text-white" : "bg-base-300 text-base-content"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs opacity-60 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-base-content/60">
              <MessageCircleIcon className="size-16 mb-4" />
              <p>Select a chat or start a new conversation</p>
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-base-300 bg-base-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="input input-bordered w-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="btn btn-primary btn-circle"
              aria-label="Send message"
              disabled={createChatbotMutation.isLoading || !message.trim()}
            >
              <SendIcon className="size-5" />
            </motion.button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ChatbotPage;