"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import useVoiceRecording from "../hooks/useVoiceRecording"
import useTextToSpeech from "../hooks/useTextToSpeech"
import useInterviewSession from "../hooks/useInterviewSession"
import { motion, AnimatePresence } from "framer-motion"
import {
  MicIcon,
  TypeIcon,
  StopCircleIcon,
  SendIcon,
  ClockIcon,
  UserIcon,
  BotIcon,
  AlertTriangleIcon,
  Volume2Icon,
  VolumeXIcon,
  RotateCcwIcon,
  DownloadIcon,
  PauseIcon,
  PlayIcon,
  ZapIcon,
  TrophyIcon,
  CoffeeIcon
} from "lucide-react"

const LiveInterview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [hasSpokenCurrentQuestion, setHasSpokenCurrentQuestion] = useState(false)
  const [isUserAnswering, setIsUserAnswering] = useState(false)
  const [inputMode, setInputMode] = useState("voice")
  const [textInput, setTextInput] = useState("")
  const [conversation, setConversation] = useState(() => {
    const saved = localStorage.getItem(`interview_${id}_transcript`)
    return saved ? JSON.parse(saved) : []
  })
  const [isPaused, setIsPaused] = useState(false)

  const {
    currentQuestion,
    transcript,
    isConnected,
    isStarting,
    isSubmitting,
    timeRemaining,
    interviewDuration,
    start,
    submitAnswer,
    end,
  } = useInterviewSession(id)

  const {
    isRecording,
    transcript: voiceTranscript,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecording()

  const { isSpeaking, speak, stopSpeaking } = useTextToSpeech()

  useEffect(() => {
    if (currentQuestion && isInterviewStarted && !hasSpokenCurrentQuestion && !isUserAnswering && !isPaused) {
      speak(currentQuestion)
      setHasSpokenCurrentQuestion(true)
    }
  }, [currentQuestion, isInterviewStarted, hasSpokenCurrentQuestion, isUserAnswering, isPaused, speak])

  useEffect(() => {
    if (currentQuestion) {
      setHasSpokenCurrentQuestion(false)
      setIsUserAnswering(false)
      setTextInput("")
    }
  }, [currentQuestion])

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining <= 0) {
      navigate(`/result/${id}`)
    }
  }, [timeRemaining, navigate, id])

  useEffect(() => {
    if (transcript.length > 0) {
      const updatedConversation = transcript.map(item => ({
        ...item,
        timestamp: new Date().toISOString(),
      }))
      setConversation(updatedConversation)
      localStorage.setItem(`interview_${id}_transcript`, JSON.stringify(updatedConversation))
    }
  }, [transcript, id])

  const formatTime = (minutes) => {
    if (minutes === null) return "--:--"
    const mins = Math.max(0, Math.floor(minutes))
    const secs = Math.max(0, Math.floor((minutes - mins) * 60))
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartInterview = async () => {
    try {
      await start()
      setIsInterviewStarted(true)
    } catch (error) {
      console.error("Error starting interview:", error)
    }
  }

  const handleEndInterview = async () => {
    try {
      stopSpeaking()
      if (isRecording) stopRecording()
      await end()
      navigate(`/result/${id}`)
    } catch (error) {
      console.error("Error ending interview:", error)
    }
  }

  const handleSubmitAnswer = async () => {
    const answer = inputMode === "voice" ? voiceTranscript : textInput
    if (!answer.trim()) return

    try {
      stopSpeaking()
      setIsUserAnswering(false)
      await submitAnswer(answer)
      if (inputMode === "voice") resetRecording()
      else setTextInput("")
      setHasSpokenCurrentQuestion(false)
    } catch (error) {
      console.error("Error submitting answer:", error)
    }
  }

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording()
      setIsUserAnswering(false)
    } else {
      if (isSpeaking) stopSpeaking()
      setIsUserAnswering(true)
      startRecording()
    }
  }

  const handleTogglePause = () => {
    if (isSpeaking) {
      stopSpeaking()
      setIsPaused(true)
    } else {
      if (currentQuestion && !hasSpokenCurrentQuestion) {
        speak(currentQuestion)
        setHasSpokenCurrentQuestion(true)
      }
      setIsPaused(false)
    }
  }

  const handleInputModeToggle = () => {
    setInputMode(inputMode === "voice" ? "text" : "voice")
    if (isRecording) stopRecording()
    setIsUserAnswering(false)
    setTextInput("")
    resetRecording()
  }

  const downloadTranscript = () => {
    const transcriptText = conversation.map(item => 
      `${item.type === 'ai' ? 'Interviewer' : 'You'}: ${item.text}`
    ).join('\n\n')
    
    const blob = new Blob([transcriptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `interview-transcript-${id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-b border-base-300/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <BotIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-base-content">Live AI Interview</h1>
                <p className="text-base-content/60">Real-time conversation with AI interviewer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleInputModeToggle}
                  disabled={isStarting || isSubmitting}
                >
                  {inputMode === "voice" ? <TypeIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />}
                  {inputMode === "voice" ? "Text" : "Voice"}
                </button>
                
                {conversation.length > 0 && (
                  <button className="btn btn-ghost btn-sm" onClick={downloadTranscript}>
                    <DownloadIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isInterviewStarted && (
                <button
                  className="btn btn-error btn-sm gap-2"
                  onClick={handleEndInterview}
                >
                  <StopCircleIcon className="w-4 h-4" />
                  End
                </button>
              )}
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-6 mt-4">
            <div className={`badge badge-lg ${isConnected ? "badge-success" : "badge-error"}`}>
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </div>
            
            {isInterviewStarted && timeRemaining !== null && (
              <>
                <div className={`badge badge-lg ${timeRemaining <= 5 ? "badge-error" : timeRemaining <= 10 ? "badge-warning" : "badge-primary"}`}>
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {formatTime(timeRemaining)} remaining
                </div>
                <div className="badge badge-lg badge-info">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {interviewDuration} min total
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {timeRemaining !== null && timeRemaining <= 5 && timeRemaining > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="alert alert-warning mb-6 shadow-lg"
          >
            <AlertTriangleIcon className="w-5 h-5" />
            <span className="font-semibold">Time Alert: Only {Math.ceil(timeRemaining)} minutes remaining!</span>
          </motion.div>
        )}

        {!isInterviewStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-base-100 shadow-2xl border border-primary/10 max-w-2xl mx-auto"
          >
            <div className="card-body p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ZapIcon className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-base-content mb-2">Ready to Begin Your Interview?</h2>
              <p className="text-base-content/70 mb-6">
                {inputMode === "voice" 
                  ? "🎤 Voice Mode: Ensure your microphone is ready in a quiet environment."
                  : "⌨️ Text Mode: Prepare to type your responses."}
              </p>
              
              <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200 mb-6">
                <div className="stat">
                  <div className="stat-title">Mode</div>
                  <div className="stat-value text-lg">{inputMode === "voice" ? "Voice" : "Text"}</div>
                  <div className="stat-desc">Response Type</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Duration</div>
                  <div className="stat-value text-lg">{interviewDuration}m</div>
                  <div className="stat-desc">Total Time</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Questions</div>
                  <div className="stat-value text-lg">5-10</div>
                  <div className="stat-desc">Estimated</div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg w-full gap-3 shadow-lg hover:shadow-xl transition-all"
                onClick={handleStartInterview}
                disabled={isStarting || !isConnected}
              >
                {isStarting ? (
                  <>
                    <div className="loading loading-spinner loading-sm"></div>
                    Starting Interview...
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5" />
                    Start Interview
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Question Panel */}
            <div className="xl:col-span-2 space-y-6">
              {/* Current Question */}
              {currentQuestion && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card bg-base-100 shadow-xl border border-primary/10"
                >
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="card-title flex items-center gap-2">
                        <BotIcon className="w-5 h-5 text-primary" />
                        AI Interviewer
                      </h3>
                      
                      <div className="flex gap-2">
                        {isSpeaking ? (
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={handleTogglePause}
                          >
                            <PauseIcon className="w-4 h-4" />
                            Pause
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={handleTogglePause}
                            disabled={!currentQuestion}
                          >
                            <Volume2Icon className="w-4 h-4" />
                            {isPaused ? "Resume" : "Repeat"}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="prose prose-lg max-w-none">
                      <p className="text-lg leading-relaxed">{currentQuestion}</p>
                    </div>
                    
                    {isSpeaking && (
                      <div className="flex items-center gap-2 mt-4 text-info">
                        <div className="flex gap-1">
                          {[1, 2, 3].map(i => (
                            <motion.div
                              key={i}
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                              className="w-2 h-2 bg-info rounded-full"
                            />
                          ))}
                        </div>
                        <span className="text-sm">AI is speaking...</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Response Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card bg-base-100 shadow-xl border border-secondary/10"
              >
                <div className="card-body">
                  <h3 className="card-title flex items-center gap-2 mb-4">
                    <UserIcon className="w-5 h-5 text-secondary" />
                    Your Response
                  </h3>

                  {inputMode === "voice" ? (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center">
                        <button
                          className={`btn btn-circle btn-lg mb-4 transition-all duration-300 ${
                            isRecording 
                              ? "btn-error animate-pulse shadow-lg" 
                              : "btn-primary hover:scale-110"
                          }`}
                          onClick={handleVoiceToggle}
                          disabled={!currentQuestion || isSpeaking}
                        >
                          {isRecording ? <StopCircleIcon className="w-8 h-8" /> : <MicIcon className="w-8 h-8" />}
                        </button>
                        
                        <div className="text-center">
                          {isSpeaking ? (
                            <div className="flex items-center justify-center gap-2 text-info">
                              <Volume2Icon className="w-4 h-4" />
                              <span>AI is speaking...</span>
                            </div>
                          ) : isRecording ? (
                            <div className="flex items-center justify-center gap-2 text-error">
                              <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                  <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-2 h-2 bg-error rounded-full"
                                  />
                                ))}
                              </div>
                              <span>Recording... Speak now</span>
                            </div>
                          ) : (
                            <span className="text-base-content/60">
                              {currentQuestion ? "Click microphone to start recording" : "Waiting for question..."}
                            </span>
                          )}
                        </div>
                      </div>

                      {voiceTranscript && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-4"
                        >
                          <div className="bg-base-200 rounded-lg p-4 min-h-24">
                            <p className="whitespace-pre-wrap">{voiceTranscript}</p>
                          </div>
                          
                          <div className="flex gap-2 justify-end">
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={resetRecording}
                            >
                              <RotateCcwIcon className="w-4 h-4" />
                              Clear
                            </button>
                            <button
                              className="btn btn-success btn-sm gap-2"
                              onClick={handleSubmitAnswer}
                              disabled={isSubmitting || !voiceTranscript.trim()}
                            >
                              {isSubmitting ? (
                                <div className="loading loading-spinner loading-sm"></div>
                              ) : (
                                <SendIcon className="w-4 h-4" />
                              )}
                              Submit Answer
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        className="textarea textarea-bordered w-full min-h-32 resize-none bg-base-200"
                        placeholder="Type your answer here..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        disabled={!currentQuestion}
                      />
                      
                      <div className="flex gap-2 justify-between">
                        <div className="text-sm text-base-content/60">
                          {textInput.length} characters
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setTextInput("")}
                            disabled={!textInput.trim()}
                          >
                            Clear
                          </button>
                          <button
                            className="btn btn-success btn-sm gap-2"
                            onClick={handleSubmitAnswer}
                            disabled={isSubmitting || !textInput.trim()}
                          >
                            {isSubmitting ? (
                              <div className="loading loading-spinner loading-sm"></div>
                            ) : (
                              <SendIcon className="w-4 h-4" />
                            )}
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Transcript Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-base-100 shadow-xl border border-base-300/30"
            >
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="card-title flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5" />
                    Interview Transcript
                  </h3>
                  <div className="badge badge-primary">{conversation.length} messages</div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  <AnimatePresence>
                    {conversation.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-base-content/50"
                      >
                        <CoffeeIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>Conversation will appear here...</p>
                        <p className="text-sm mt-2">Start answering questions to see the transcript</p>
                      </motion.div>
                    ) : (
                      conversation.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`chat ${item.type === "ai" ? "chat-start" : "chat-end"}`}
                        >
                          <div className="chat-image avatar">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              item.type === "ai" ? "bg-primary/20" : "bg-secondary/20"
                            }`}>
                              {item.type === "ai" ? (
                                <BotIcon className="w-4 h-4 text-primary" />
                              ) : (
                                <UserIcon className="w-4 h-4 text-secondary" />
                              )}
                            </div>
                          </div>
                          
                          <div className="chat-header flex items-center gap-2 mb-1">
                            {item.type === "ai" ? "AI Interviewer" : "You"}
                            <time className="text-xs opacity-50">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </time>
                          </div>
                          
                          <div className={`chat-bubble ${
                            item.type === "ai" ? "chat-bubble-primary" : "chat-bubble-secondary"
                          }`}>
                            {item.text}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveInterview