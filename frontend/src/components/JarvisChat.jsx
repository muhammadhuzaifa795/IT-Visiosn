"use client"

import React, { useState, useRef, useEffect } from "react"
import { useAskJarvis, useConversations, useDeleteConversation } from "../hooks/useJarvis"
import { useSpeech } from "../hooks/useSpeech"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Send, RefreshCw, Loader2, Trash, Database, User, MessageSquare, Zap, Brain, Sparkles, FileText, ArrowLeft, Bot, Settings, Download } from "lucide-react"
import { useNavigate } from "react-router"
import Navbar from "./Navbar"

const JarvisChat = () => {
  const [question, setQuestion] = useState("")
  const [sessionId, setSessionId] = useState(null)
  const [inputMode, setInputMode] = useState("text")
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const [expandedData, setExpandedData] = useState({})
  const [showSidebar, setShowSidebar] = useState(true)

  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)
  const askMutation = useAskJarvis()
  const conversations = useConversations()
  const { speak, listening, transcript, resetTranscript, isSupported } = useSpeech()
  const deleteMutation = useDeleteConversation()
  const navigate = useNavigate()

  useEffect(() => {
    if (conversations.data?.length > 0 && !sessionId) {
      setSessionId(conversations.data[0]._id)
    }
  }, [conversations.data, sessionId])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [askMutation.data, transcript, aiThinking])

  useEffect(() => {
    if (inputMode === "voice" && transcript) {
      setQuestion(transcript)
    }
  }, [transcript, inputMode])

  // Fixed: Single source of truth for loading states
  useEffect(() => {
    if (askMutation.isLoading) {
      setAiThinking(true)
      setIsProcessing(true)
    } else {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setAiThinking(false)
        setIsProcessing(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [askMutation.isLoading])

  const handleSend = async () => {
    if (!question.trim() || isProcessing) return

    try {
      setAiThinking(true)
      setIsProcessing(true)

      const result = await askMutation.mutateAsync(question)

      // Reset states immediately after successful response
      setAiThinking(false)
      setIsProcessing(false)

      if (inputMode === "voice") {
        speak(result.answer)
      }
      resetTranscript()
      setQuestion("")

      if (inputRef.current) {
        inputRef.current.focus()
      }
    } catch (err) {
      console.error("Error communicating with Codezynx:", err)
      // Ensure states are reset even on error
      setAiThinking(false)
      setIsProcessing(false)
    }
  }

  const startVoiceInput = () => {
    if (isProcessing) return
    setInputMode("voice")
    setQuestion("")
    resetTranscript()
  }

  const stopVoiceInput = () => {
    setInputMode("text")
    resetTranscript()
  }

  const startNewChat = () => {
    if (isProcessing) {
      // Don't allow new chat while processing
      return
    }
    setSessionId(null)
    setQuestion("")
    resetTranscript()
    setInputMode("text")
    setExpandedData({})
    // Reset any ongoing mutations
    askMutation.reset()
  }

  const toggleDataSection = (messageIndex, section) => {
    setExpandedData(prev => ({
      ...prev,
      [`${messageIndex}-${section}`]: !prev[`${messageIndex}-${section}`]
    }))
  }

  const downloadConversation = () => {
    if (isProcessing) return

    const currentConversation = conversations.data?.find(conv => conv._id === sessionId)
    if (!currentConversation) return

    const content = currentConversation.messages.map(msg =>
      `${msg.role === 'user' ? 'You' : 'Codezynx AI'}: ${msg.text}\n${msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}\n\n`
    ).join('---\n\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `codezynx-chat-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const currentConversation = conversations.data?.find(conv => conv._id === sessionId)
  const messages = currentConversation?.messages || []

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/20 to-base-300/10 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-[calc(100vh-2rem)] max-w-[100vw]"
        >
          <div className="w-full h-full flex bg-base-100/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-base-300/30">
            <AnimatePresence>
              {showSidebar && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="w-80 bg-base-100/50 backdrop-blur-2xl border-r border-base-300/30 flex flex-col"
                >
                  <div className="p-4 border-b border-base-300/30">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-base-content/80 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        CONVERSATIONS
                      </h3>
                      <button
                        onClick={() => setShowSidebar(false)}
                        className="p-2 hover:bg-base-200/50 rounded-lg transition-colors"
                        disabled={isProcessing}
                      >
                        <ArrowLeft className="w-4 h-4 text-base-content/60" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {conversations.data?.map(conv => (
                      <motion.div
                        key={conv._id}
                        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                        onClick={() => !isProcessing && setSessionId(conv._id)}
                        className={`p-4 cursor-pointer rounded-xl transition-all ${sessionId === conv._id
                          ? "bg-primary/20 border border-primary/50 shadow-lg shadow-primary/20"
                          : "bg-base-200/10 hover:bg-base-200/20 border border-base-300/30"
                          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className="text-base-content text-sm font-medium truncate">
                              {conv.title}
                            </p>
                            <p className="text-base-content/50 text-xs mt-1">
                              {new Date(conv.updatedAt).toLocaleDateString()} •
                              {new Date(conv.updatedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!isProcessing) {
                                deleteMutation.mutate(conv._id)
                              }
                            }}
                            className={`text-base-content/50 transition-colors p-1 ${isProcessing ? "cursor-not-allowed opacity-50" : "hover:text-error"}`}
                            disabled={isProcessing}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-base-300/30">
                    <button
                      onClick={() => !isProcessing && navigate(-1)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-xl transition-all ${isProcessing
                          ? "bg-base-200/10 border-base-300/30 text-base-content/50 cursor-not-allowed"
                          : "bg-base-200/10 hover:bg-base-200/20 border-base-300/30 text-base-content"
                        }`}
                      disabled={isProcessing}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Go Back
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex-1 flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-base-100/50 backdrop-blur-2xl border-b border-base-300/30 px-6 py-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {!showSidebar && (
                      <button
                        onClick={() => !isProcessing && setShowSidebar(true)}
                        className={`p-2 rounded-lg transition-colors ${isProcessing ? "cursor-not-allowed opacity-50" : "hover:bg-base-200/50"}`}
                        disabled={isProcessing}
                      >
                        <MessageSquare className="w-5 h-5 text-base-content/60" />
                      </button>
                    )}
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                      <Bot className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Codezynx AI Assistant (Beta version)
                      </h1>
                      <p className="text-base-content/70 text-sm">Your intelligent Appliaction AI assistant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 text-base-content/70 text-sm">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: aiThinking ? [1, 1.2, 1] : 1 }}
                          transition={{ repeat: aiThinking ? Infinity : 0, duration: 0.8 }}
                          className={`w-2 h-2 rounded-full ${aiThinking ? "bg-warning" : "bg-success"} shadow-lg`}
                        />
                        <span>{aiThinking ? "THINKING" : "ONLINE"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {messages.length > 0 && (
                        <motion.button
                          whileHover={{ scale: isProcessing ? 1 : 1.05 }}
                          whileTap={{ scale: isProcessing ? 1 : 0.95 }}
                          onClick={downloadConversation}
                          className={`px-3 py-2 border rounded-xl transition-all flex items-center gap-2 ${isProcessing
                            ? "bg-base-200/10 border-base-300/30 text-base-content/50 cursor-not-allowed"
                            : "bg-base-200/10 hover:bg-base-200/20 border-base-300/30 text-base-content"
                            }`}
                          disabled={isProcessing}
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: isProcessing ? 1 : 1.05 }}
                        whileTap={{ scale: isProcessing ? 1 : 0.95 }}
                        onClick={startNewChat}
                        className={`px-4 py-2 rounded-xl shadow-lg transition-all flex items-center gap-2 ${isProcessing
                          ? "bg-base-300 text-base-content/50 cursor-not-allowed"
                          : "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-primary/30"
                          }`}
                        disabled={isProcessing}
                      >
                        <RefreshCw className="w-4 h-4" />
                        New Chat
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-base-200/10"
              >
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex items-center justify-center"
                  >
                    <div className="text-center max-w-2xl">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-base-300/30"
                      >
                        <Sparkles className="w-12 h-12 text-primary" />
                      </motion.div>
                      <h2 className="text-3xl font-bold text-base-content mb-4">
                        Welcome to Codezynx AI
                      </h2>
                      <p className="text-base-content/70 text-lg mb-8">
                        Your intelligent coding assistant — powered by Codezynx.
                        I can fetch personalized data from our platform's database,
                        guide you about Codezynx features, and help you with coding or tech topics.
                        Just ask me anything!
                      </p>
                    </div>
                  </motion.div>
                )}
                {messages.map((msg, idx) => (
                  <AIMessage
                    key={idx}
                    message={msg}
                    index={idx}
                    expandedData={expandedData}
                    onToggleData={toggleDataSection}
                  />
                ))}
                {inputMode === "voice" && listening && transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-2xl bg-base-200/10 backdrop-blur-md border border-primary/50 rounded-2xl p-4 shadow-lg shadow-primary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{
                                repeat: Infinity,
                                duration: 0.8,
                                delay: i * 0.2
                              }}
                              className="w-2 h-2 bg-primary rounded-full"
                            />
                          ))}
                        </div>
                        <span className="text-primary text-sm font-medium">LISTENING...</span>
                      </div>
                      <p className="text-base-content font-light text-lg">{transcript}</p>
                    </div>
                  </motion.div>
                )}
                {aiThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-2xl bg-base-200/10 backdrop-blur-md border border-warning/50 rounded-2xl p-5 shadow-lg shadow-warning/20">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Brain className="w-5 h-5 text-warning" />
                        </motion.div>
                        <span className="text-warning text-sm font-medium">CODEZYX PROCESSING</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          "Analyzing query intent...",
                          "Accessing knowledge base...",
                          "Generating intelligent response...",
                          "Optimizing output format..."
                        ].map((text, index) => (
                          <motion.div
                            key={text}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.3 }}
                            className="flex items-center gap-3 text-base-content/70 text-sm"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                delay: index * 0.5
                              }}
                              className="w-1.5 h-1.5 bg-warning rounded-full"
                            />
                            <span>{text}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-4 w-full bg-base-200/20 rounded-full h-2">
                        <motion.div
                          animate={{
                            width: ["0%", "100%"],
                            transition: { duration: 2, repeat: Infinity }
                          }}
                          className="bg-gradient-to-r from-warning to-warning/70 h-2 rounded-full shadow-lg shadow-warning/30"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-base-300/30 p-6 bg-base-100/50 backdrop-blur-2xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.button
                    whileHover={{ scale: isProcessing ? 1 : 1.05 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.95 }}
                    onClick={inputMode === "text" ? startVoiceInput : stopVoiceInput}
                    className={`px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 ${inputMode === "voice"
                      ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30"
                      : "bg-base-200/10 border border-base-300/30 text-base-content hover:bg-base-200/20"
                      } ${!isSupported || isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isSupported || isProcessing}
                  >
                    <Mic className="w-4 h-4" />
                    {inputMode === "voice" ? "STOP VOICE" : "VOICE INPUT"}
                  </motion.button>
                  {inputMode === "voice" && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary"
                      />
                      VOICE ACTIVE
                    </div>
                  )}
                  <div className="ml-auto flex items-center gap-3 text-xs text-base-content/50">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: isProcessing ? [1, 1.3, 1] : 1 }}
                        transition={{ repeat: isProcessing ? Infinity : 0, duration: 0.8 }}
                        className={`w-2 h-2 rounded-full ${isProcessing ? "bg-warning" : "bg-success"} shadow-lg`}
                      />
                      {isProcessing ? "PROCESSING" : "READY"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="w-full border-2 border-base-300/30 rounded-2xl px-5 py-4 bg-base-100/50 backdrop-blur-sm outline-none transition-all duration-300 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-2xl focus:shadow-primary/10 placeholder:text-base-content/40 resize-none font-light text-lg"
                      placeholder={
                        isProcessing
                          ? "Codezynx is processing your request..."
                          : inputMode === "voice"
                            ? "Speak now... (Voice mode active)"
                            : "Ask Codezynx anything... (Press Enter to send)"
                      }
                      rows="2"
                      disabled={isProcessing || (inputMode === "voice" && listening)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !isProcessing) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-base-content/50">
                      {question.length}/500
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: isProcessing ? 1 : 1.05 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.95 }}
                    onClick={handleSend}
                    disabled={isProcessing || !question.trim()}
                    className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${isProcessing || !question.trim()
                      ? "bg-base-200/10 text-base-content/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-secondary shadow-2xl hover:shadow-primary/40 text-white"
                      }`}
                  >
                    <AnimatePresence mode="wait">
                      {isProcessing ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="animate-spin w-5 h-5" />
                          PROCESSING
                        </motion.div>
                      ) : (
                        <motion.div
                          key="send"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Send className="w-5 h-5" />
                          SEND
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

const AIMessage = ({ message, index, expandedData, onToggleData }) => {
  const hasData = message.data && Object.keys(message.data).some(key =>
    message.data[key] && message.data[key].length > 0
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-2xl rounded-2xl p-5 shadow-xl ${message.role === "user"
          ? "bg-base-200/10 border border-base-300/30 text-base-content"
          : "bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 text-base-content shadow-primary/20"
          } backdrop-blur-sm`}
      >
        <div className="flex items-center gap-3 mb-3">
          {message.role === "assistant" && (
            <>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary"
              />
              <span className="text-primary text-sm font-semibold tracking-wide flex items-center gap-2">
                <Bot className="w-4 h-4" />
                CODEZYX AI
              </span>
            </>
          )}
          {message.role === "user" && (
            <>
              <div className="w-3 h-3 bg-base-content/50 rounded-full" />
              <span className="text-base-content/70 text-sm font-semibold tracking-wide flex items-center gap-2">
                <User className="w-4 h-4" />
                YOU
              </span>
            </>
          )}
          <span className="text-base-content/50 text-xs ml-auto">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>
        <div className="leading-relaxed text-base-content text-lg">
          {message.text}
        </div>
        {hasData && (
          <div className="mt-4 pt-4 border-t border-base-300/30">
            <div className="text-sm text-base-content/70 mb-3 font-medium">DATA RETRIEVED:</div>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(message.data).map(([key, items]) => {
                if (!items || items.length === 0) return null

                const isExpanded = expandedData[`${index}-${key}`]
                const config = {
                  tickets: { icon: FileText, color: "bg-primary", label: "TICKETS" },
                  posts: { icon: MessageSquare, color: "bg-secondary", label: "POSTS" },
                  roadmaps: { icon: Brain, color: "bg-success", label: "ROADMAPS" },
                  interviews: { icon: User, color: "bg-warning", label: "INTERVIEWS" },
                  leaderboard: { icon: Zap, color: "bg-info", label: "LEADERBOARD" }
                }[key]

                if (!config) return null

                return (
                  <motion.div
                    key={key}
                    initial={false}
                    animate={{ height: isExpanded ? "auto" : "60px" }}
                    className="bg-base-200/10 rounded-xl border border-base-300/30 overflow-hidden"
                  >
                    <button
                      onClick={() => onToggleData(index, key)}
                      className="w-full p-4 flex items-center justify-between hover:bg-base-200/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center`}>
                          <config.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-base-content font-medium text-sm">
                            {config.label}
                          </div>
                          <div className="text-base-content/50 text-xs">
                            {items.length} items found
                          </div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-base-content/50"
                      >
                        ▼
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4 border-t border-base-300/30 space-y-3 max-h-60 overflow-y-auto">
                            {items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="p-3 bg-base-200/10 rounded-lg border border-base-300/30"
                              >
                                <div className="text-base-content text-sm font-medium">
                                  {item.title || item.goal || item.topic}
                                </div>
                                {item.status && (
                                  <div className="text-base-content/70 text-xs mt-1">
                                    Status: {item.status}
                                  </div>
                                )}
                                {item.priority && (
                                  <div className="text-base-content/70 text-xs">
                                    Priority: {item.priority}
                                  </div>
                                )}
                                {item.createdAt && (
                                  <div className="text-base-content/70 text-xs">
                                    Created: {new Date(item.createdAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default JarvisChat