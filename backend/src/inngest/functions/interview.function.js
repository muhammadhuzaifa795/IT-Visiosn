import { inngest } from "../client.js"
import { evaluateAnswer } from "../agent.js"
import InterviewResult from "../../models/InterviewResult.js"

export const evalFlow = inngest.createFunction(
  {
    id: "evaluate-answer",
    name: "evaluateAnswer",
  },
  { event: "interview/answer" },
  async ({ event, step }) => {
    const { interviewId, question, answer, userId } = event.data

    // Step 1: Validate input data
    const validatedData = await step.run("validate-input", async () => {
      if (!interviewId || !question || !answer) {
        throw new Error("Missing required fields: interviewId, question, answer")
      }
      return { interviewId, question, answer, userId }
    })

    // Step 2: Generate AI feedback
    const feedback = await step.run("generate-feedback", async () => {
      try {
        return await evaluateAnswer(validatedData.question, validatedData.answer)
      } catch (error) {
        console.error("Error generating feedback:", error)
        return "Unable to generate feedback at this time. Score: 5/10"
      }
    })

    // Step 3: Parse feedback and extract score
    const parsedFeedback = await step.run("parse-feedback", async () => {
      let score = 5 // default score

      // Clean special characters from feedback
      const cleanFeedback = feedback
        .replace(/[^\w\s\-?.,:\n/()]/g, "") // Remove special chars but keep basic punctuation
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()

      // Try to extract score from feedback
      const scoreMatch = cleanFeedback.match(/Score:\s*(\d+)\/10/i)
      if (scoreMatch) {
        score = Number.parseInt(scoreMatch[1])
        score = Math.max(1, Math.min(10, score)) // Ensure score is between 1-10
      }

      // Extract different parts of feedback
      const feedbackMatch = cleanFeedback.match(/Feedback:\s*(.*?)(?=Strengths:|Improvements:|$)/is)
      const strengthsMatch = cleanFeedback.match(/Strengths:\s*(.*?)(?=Improvements:|$)/is)
      const improvementsMatch = cleanFeedback.match(/Improvements:\s*(.*?)$/is)

      return {
        score,
        feedback: feedbackMatch ? feedbackMatch[1].trim() : cleanFeedback,
        strengths: strengthsMatch ? strengthsMatch[1].trim() : "",
        improvements: improvementsMatch ? improvementsMatch[1].trim() : "",
        rawFeedback: cleanFeedback,
      }
    })

    // Step 4: Save to database
    const result = await step.run("save-to-database", async () => {
      try {
        const updatedResult = await InterviewResult.findOneAndUpdate(
          { interview: validatedData.interviewId },
          {
            $push: {
              answers: {
                question: validatedData.question,
                answer: validatedData.answer,
                feedback: parsedFeedback.feedback,
                score: parsedFeedback.score,
                strengths: parsedFeedback.strengths,
                improvements: parsedFeedback.improvements,
                rawFeedback: parsedFeedback.rawFeedback,
                timestamp: new Date(),
              },
            },
          },
          { upsert: true, new: true },
        )
        return updatedResult
      } catch (error) {
        console.error("Error saving to database:", error)
        throw new Error("Failed to save evaluation to database")
      }
    })

    // Step 5: Send notification (optional)
    await step.run("send-notification", async () => {
      console.log(`✅ Answer evaluated for interview ${validatedData.interviewId}`)
      console.log(`Score: ${parsedFeedback.score}/10`)
      return { notificationSent: true }
    })

    return {
      success: true,
      interviewId: validatedData.interviewId,
      score: parsedFeedback.score,
      feedback: parsedFeedback.feedback,
      resultId: result._id,
    }
  },
)

// Function to trigger answer evaluation
export const triggerAnswerEvaluation = async (interviewId, question, answer, userId) => {
  try {
    await inngest.send({
      name: "interview/answer",
      data: {
        interviewId,
        question,
        answer,
        userId,
        timestamp: new Date().toISOString(),
      },
    })
    console.log(`📤 Triggered evaluation for interview ${interviewId}`)
  } catch (error) {
    console.error("Error triggering answer evaluation:", error)
    throw new Error("Failed to trigger answer evaluation")
  }
}
