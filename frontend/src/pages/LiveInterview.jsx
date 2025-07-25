"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import useVoiceRecording  from "../hooks/useVoiceRecording"
import useTextToSpeech  from "../hooks/useTextToSpeech"
import useInterviewSession from "../hooks/useInterviewSession"

const LiveInterview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [hasSpokenCurrentQuestion, setHasSpokenCurrentQuestion] = useState(false)
  const [isUserAnswering, setIsUserAnswering] = useState(false)

  // Use the interview session hook
  const {
    currentQuestion,
    transcript,
    isConnected,
    isStarting,
    isSubmitting,
    timeRemaining,
    interviewDuration,
    start,
    submitAnswer: submitUserAnswer,
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

  // Speak questions when they arrive (only once and not while user is answering)
  useEffect(() => {
    if (currentQuestion && isInterviewStarted && !hasSpokenCurrentQuestion && !isUserAnswering) {
      speak(currentQuestion)
      setHasSpokenCurrentQuestion(true)
    }
  }, [currentQuestion, isInterviewStarted, hasSpokenCurrentQuestion, isUserAnswering, speak])

  // Reset spoken flag when new question arrives
  useEffect(() => {
    if (currentQuestion) {
      setHasSpokenCurrentQuestion(false)
      setIsUserAnswering(false)
    }
  }, [currentQuestion])

  // Auto-end interview when time is up
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining <= 0) {
      navigate(`/result/${id}`)
    }
  }, [timeRemaining, navigate, id])

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
      // Stop any ongoing speech
      stopSpeaking()
      await end()
      navigate(`/result/${id}`)
    } catch (error) {
      console.error("Error ending interview:", error)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!voiceTranscript.trim()) return

    try {
      // Stop any ongoing speech before submitting
      stopSpeaking()
      setIsUserAnswering(false)

      await submitUserAnswer(voiceTranscript)
      resetRecording()

      // Reset flags for next question
      setHasSpokenCurrentQuestion(false)
    } catch (error) {
      console.error("Error submitting answer:", error)
    }
  }

  const handleVoiceToggle = () => {
    if (isRecording) {
      // User stopped recording - they're done answering
      stopRecording()
      setIsUserAnswering(false)
    } else {
      // User started recording - stop any speech and mark as answering
      if (isSpeaking) {
        stopSpeaking()
      }
      setIsUserAnswering(true)
      startRecording()
    }
  }

  const handleStopSpeaking = () => {
    stopSpeaking()
    setIsUserAnswering(true) // User wants to answer now
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">🎤 Live Interview</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className={`badge ${isConnected ? "badge-success" : "badge-error"}`}>
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </div>
            {isInterviewStarted && timeRemaining !== null && (
              <div
                className={`badge ${timeRemaining <= 5 ? "badge-error" : timeRemaining <= 10 ? "badge-warning" : "badge-primary"}`}
              >
                ⏱️ {formatTime(timeRemaining)} remaining
              </div>
            )}
            {isInterviewStarted && <div className="badge badge-info">📊 Duration: {interviewDuration} min</div>}
          </div>
        </div>
        {isInterviewStarted && (
          <button className="btn btn-error" onClick={handleEndInterview}>
            🛑 End Interview
          </button>
        )}
      </div>

      {/* Time Warning */}
      {timeRemaining !== null && timeRemaining <= 5 && timeRemaining > 0 && (
        <div className="alert alert-warning mb-4">
          <span>⚠️ Only {Math.ceil(timeRemaining)} minutes remaining!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Interview Controls */}
        <div className="space-y-6">
          {!isInterviewStarted ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold mb-4">Ready to Begin?</h2>
                <p className="text-base-content/70 mb-4">Duration: {interviewDuration} minutes</p>
                <p className="text-base-content/70 mb-6">
                  Make sure your microphone is working and you're in a quiet environment.
                </p>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleStartInterview}
                  disabled={isStarting || !isConnected}
                >
                  {isStarting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Starting...
                    </>
                  ) : (
                    "🚀 Start Interview"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Current Question */}
              {currentQuestion && (
                <div className="card bg-primary text-primary-content shadow-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">🤖 AI Interviewer asks:</h3>
                        <p className="text-lg">{currentQuestion}</p>
                      </div>
                      <div className="flex gap-2">
                        {isSpeaking && (
                          <button className="btn btn-sm btn-outline btn-primary-content" onClick={handleStopSpeaking}>
                            🔇 Stop Speaking
                          </button>
                        )}
                        {!isSpeaking && !hasSpokenCurrentQuestion && (
                          <button
                            className="btn btn-sm btn-outline btn-primary-content"
                            onClick={() => {
                              speak(currentQuestion)
                              setHasSpokenCurrentQuestion(true)
                            }}
                          >
                            🔊 Repeat Question
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Voice Controls */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">🎙️ Your Response</h3>

                  <div className="flex items-center justify-center mb-6">
                    <button
                      className={`btn btn-circle btn-lg ${isRecording ? "btn-error animate-pulse" : "btn-primary"}`}
                      onClick={handleVoiceToggle}
                      disabled={!currentQuestion}
                    >
                      {isRecording ? "⏹️" : "🎤"}
                    </button>
                  </div>

                  <div className="text-center mb-4">
                    {isSpeaking ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="loading loading-dots loading-sm"></span>
                        <span className="text-info font-medium">AI is speaking... Click "Stop Speaking" to answer</span>
                      </div>
                    ) : isRecording ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="loading loading-dots loading-sm"></span>
                        <span className="text-error font-medium">Recording your answer...</span>
                      </div>
                    ) : (
                      <span className="text-base-content/70">
                        {currentQuestion ? "Click microphone to record your answer" : "Waiting for question..."}
                      </span>
                    )}
                  </div>

                  {voiceTranscript && (
                    <div className="space-y-4">
                      <div className="textarea textarea-bordered min-h-24 p-4 bg-base-200">{voiceTranscript}</div>
                      <div className="flex gap-2 justify-end">
                        <button className="btn btn-outline" onClick={resetRecording}>
                          🗑️ Clear
                        </button>
                        <button
                          className="btn btn-success"
                          onClick={handleSubmitAnswer}
                          disabled={isSubmitting || !voiceTranscript.trim()}
                        >
                          {isSubmitting ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : (
                            "📤 Submit Answer"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Transcript */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">💬 Interview Transcript</h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transcript.length === 0 ? (
                <div className="text-center py-8 text-base-content/50">
                  <div className="text-4xl mb-2">📝</div>
                  <p>Conversation will appear here...</p>
                </div>
              ) : (
                transcript.map((item, index) => (
                  <div key={index} className={`chat ${item.type === "ai" ? "chat-start" : "chat-end"}`}>
                    <div className="chat-header">
                      {item.type === "ai" ? "🤖 AI Interviewer" : "👤 You"}
                      <time className="text-xs opacity-50 ml-2">{new Date().toLocaleTimeString()}</time>
                    </div>
                    <div
                      className={`chat-bubble ${item.type === "ai" ? "chat-bubble-primary" : "chat-bubble-secondary"}`}
                    >
                      {item.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveInterview
