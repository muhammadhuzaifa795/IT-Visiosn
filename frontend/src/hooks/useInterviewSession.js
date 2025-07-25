"use client"

import { useState, useEffect, useCallback } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { io } from "socket.io-client"
import { startInterview, endInterview, submitAnswer, getInterviewResults } from "../lib/api"

const SOCKET_URL = "http://localhost:5000"

const useInterviewSession = (interviewId, userId) => {
  const [socket, setSocket] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [transcript, setTranscript] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  // Start interview mutation
  const startInterviewMutation = useMutation({
    mutationFn: () => startInterview(interviewId),
  })

  // End interview mutation
  const endInterviewMutation = useMutation({
    mutationFn: () => endInterview(interviewId),
  })

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: (answer) =>
      submitAnswer({
        interviewId,
        question: currentQuestion,
        answer,
      }),
  })

  // Get results query
  const resultsQuery = useQuery({
    queryKey: ["interviewResults", interviewId],
    queryFn: () => getInterviewResults(interviewId),
    enabled: false,
  })

  // Initialize socket connection
  useEffect(() => {
    if (!interviewId) return

    const socketInstance = io(SOCKET_URL, {
      withCredentials: true,
    })

    socketInstance.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)
      socketInstance.emit("join-room", interviewId)
    })

    socketInstance.on("question", (question) => {
      setCurrentQuestion(question)
      // Add question to transcript
      setTranscript((prev) => [...prev, { type: "ai", text: question }])
    })

    socketInstance.on("transcript", (answer) => {
      // This is for receiving our own answers back from the server
      // We'll handle this differently since we're adding answers directly
    })

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error)
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [interviewId])

  // Start the interview
  const start = useCallback(async () => {
    try {
      await startInterviewMutation.mutateAsync()
      // Socket will handle receiving the first question
    } catch (error) {
      console.error("Failed to start interview:", error)
    }
  }, [startInterviewMutation])

  // Submit an answer
  const submitUserAnswer = useCallback(
    async (answer) => {
      try {
        // Add answer to transcript
        setTranscript((prev) => [...prev, { type: "user", text: answer }])

        // Submit to server
        if (socket) {
          socket.emit("answer", { interviewId, question: currentQuestion, answer })
        }

        // Also submit to API for evaluation
        await submitAnswerMutation.mutateAsync(answer)
      } catch (error) {
        console.error("Failed to submit answer:", error)
      }
    },
    [interviewId, currentQuestion, socket, submitAnswerMutation],
  )

  // End the interview
  const end = useCallback(async () => {
    try {
      await endInterviewMutation.mutateAsync()
      // Fetch results
      resultsQuery.refetch()
    } catch (error) {
      console.error("Failed to end interview:", error)
    }
  }, [endInterviewMutation, resultsQuery])

  return {
    currentQuestion,
    transcript,
    isConnected,
    isStarting: startInterviewMutation.isPending,
    isEnding: endInterviewMutation.isPending,
    isSubmitting: submitAnswerMutation.isPending,
    start,
    submitAnswer: submitUserAnswer,
    end,
    results: resultsQuery.data?.data,
    isLoadingResults: resultsQuery.isLoading,
  }
}

export default useInterviewSession
