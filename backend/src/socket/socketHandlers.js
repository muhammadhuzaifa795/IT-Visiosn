import Interview from "../models/Interview.js"
import { generateQuestion } from "../inngest/agent.js"

export const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id)

    // Handle post-related socket events
    socket.on("join_post", (postId) => {
      socket.join(postId)
      console.log(`🔗 User joined post room: ${postId}`)
    })

    socket.on("leave_post", (postId) => {
      socket.leave(postId)
      console.log(`❌ User left post room: ${postId}`)
    })

    // Handle interview-related socket events
    socket.on("join-room", async (interviewId) => {
      if (!interviewId || typeof interviewId !== "string") {
        console.error("Invalid interviewId for join-room:", interviewId)
        socket.emit("error", "Invalid interview ID")
        return
      }

      socket.join(interviewId)
      console.log(`🔗 User joined interview room: ${interviewId}`)

      try {
        const interview = await Interview.findById(interviewId)
        if (!interview) {
          socket.emit("error", "Interview not found")
          return
        }

        const { topic, level } = interview
        const question = await generateQuestion(level, topic)
        console.log(`Emitting question for interview ${interviewId}:`, question)
        io.to(interviewId).emit("question", question)
      } catch (error) {
        console.error("Error generating question:", error)
        socket.emit("error", "Failed to generate question")
      }
    })

    socket.on("answer", async ({ interviewId, question, answer }) => {
      if (!interviewId || !answer || typeof interviewId !== "string" || typeof answer !== "string") {
        console.error("Invalid answer data:", { interviewId, answer })
        socket.emit("error", "Invalid answer data")
        return
      }

      console.log(`📝 Answer submitted for interview ${interviewId}:`, { question, answer })
      io.to(interviewId).emit("transcript", answer)

      // Generate next question
      try {
        const interview = await Interview.findById(interviewId)
        if (!interview) {
          socket.emit("error", "Interview not found")
          return
        }

        const { topic, level } = interview
        const nextQuestion = await generateQuestion(level, topic)
        console.log(`Emitting next question for interview ${interviewId}:`, nextQuestion)
        io.to(interviewId).emit("question", nextQuestion)
      } catch (error) {
        console.error("Error generating next question:", error)
        socket.emit("error", "Failed to generate next question")
      }
    })

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected:", socket.id)
    })
  })
}
