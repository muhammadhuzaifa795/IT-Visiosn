import Interview from "../models/Interview.js"
import InterviewResult from "../models/InterviewResult.js"
import { evaluateAnswer } from "../inngest/agent.js"

export const createInterview = async (req, res) => {
  try {
    const { topic, level, duration } = req.body
    const user = req.user._id // From protectRoute middleware

    if (!topic || !level || !duration) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: topic, level, and duration are required",
      })
    }

    // Validate level
    if (!["beginner", "intermediate", "advanced"].includes(level)) {
      return res.status(400).json({
        success: false,
        message: "Level must be beginner, intermediate, or advanced",
      })
    }

    // Validate duration
    if (duration < 15 || duration > 120) {
      return res.status(400).json({
        success: false,
        message: "Duration must be between 15 and 120 minutes",
      })
    }

    const interview = await Interview.create({
      user,
      topic: topic.trim(),
      level,
      duration,
    })

    // Create corresponding result document
    await InterviewResult.create({
      interview: interview._id,
      answers: [],
    })

    res.status(201).json({
      success: true,
      data: {
        interviewId: interview._id.toString(),
        interview,
      },
    })
  } catch (error) {
    console.error("Error creating interview:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create interview",
    })
  }
}

export const getInterview = async (req, res) => {
  try {
    const { userId } = req.params

    const interviews = await Interview.find({ user: userId }).populate("user", "name email").sort({ createdAt: -1 })

    if (!interviews.length) {
      return res.status(404).json({
        success: false,
        message: "No interviews found",
      })
    }

    res.json({
      success: true,
      data: interviews,
    })
  } catch (error) {
    console.error("Error fetching interviews:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const startInterview = async (req, res) => {
  try {
    const { id } = req.params

    const interview = await Interview.findByIdAndUpdate(
      id,
      {
        status: "running",
        startedAt: new Date(),
      },
      { new: true },
    )

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      })
    }

    res.json({
      success: true,
      data: interview,
    })
  } catch (error) {
    console.error("Error starting interview:", error)
    res.status(500).json({
      success: false,
      message: "Failed to start interview",
    })
  }
}

export const endInterview = async (req, res) => {
  try {
    const { id } = req.params

    const interview = await Interview.findByIdAndUpdate(
      id,
      {
        status: "ended",
        endedAt: new Date(),
      },
      { new: true },
    )

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      })
    }

    res.json({
      success: true,
      data: interview,
    })
  } catch (error) {
    console.error("Error ending interview:", error)
    res.status(500).json({
      success: false,
      message: "Failed to end interview",
    })
  }
}

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, question, answer } = req.body

    if (!interviewId || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      })
    }

    // Add answer to interview
    const interview = await Interview.findByIdAndUpdate(
      interviewId,
      {
        $push: {
          questions: {
            question,
            answer,
            timestamp: new Date(),
          },
        },
      },
      { new: true },
    )

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      })
    }

    // Evaluate the answer
    const feedback = await evaluateAnswer(question, answer)

    // Extract score from feedback (assuming format "Score: X/10...")
    let score = null
    const scoreMatch = feedback.match(/Score:\s*(\d+)/i)
    if (scoreMatch) {
      score = Number.parseInt(scoreMatch[1])
    }

    // Update interview result
    await InterviewResult.findOneAndUpdate(
      { interview: interviewId },
      {
        $push: {
          answers: {
            question,
            answer,
            feedback,
            score,
          },
        },
      },
      { upsert: true },
    )

    res.json({
      success: true,
      data: {
        feedback,
        score,
      },
    })
  } catch (error) {
    console.error("Error submitting answer:", error)
    res.status(500).json({
      success: false,
      message: "Failed to submit answer",
    })
  }
}
