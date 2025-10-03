import { inngest } from "../client.js"
import InterviewResult from "../../models/InterviewResult.js"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createAgent } from "@inngest/agent-kit"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const geminiAdaptor = {
  name: "gemini",
  async handler({ messages }) {
    try {
      const prompt = messages.map((m) => m.content).join("\n")
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
      const result = await model.generateContent(prompt)
      const cleanedResponse = result.response.text().replace(/\s+/g, " ").trim()
      return cleanedResponse
    } catch (error) {
      console.error("Gemini API error:", error.message)
      throw new Error(`Failed to generate content: ${error.message}`)
    }
  },
}



export async function generateQuestion(level, topic, previousQuestions = []) {
  if (!level || !topic || typeof level !== "string" || typeof topic !== "string") {
    throw new Error("Invalid level or topic")
  }
  let prompt = `You are acting as a senior interviewer conducting a ${level} level interview.
Ask ONE realistic interview question on ${topic}.
Guidelines:
- Keep it under 20 words
- Must sound like a real interviewer question
Return ONLY the question.`
  if (previousQuestions.length > 0) {
    prompt += `\n\nAvoid repeating these:\n${previousQuestions.join("\n")}`
  }
  const messages = [{ role: "user", content: prompt }]
  const response = await geminiAdaptor.handler({ messages })
  return response.replace(/^(Question:|Q:)\s*/i, "").replace(/\?+$/, "?").trim()
}

export async function evaluateAnswer(question, answer) {
  if (!question || !answer || typeof question !== "string" || typeof answer !== "string") {
    throw new Error("Invalid question or answer")
  }
  const prompt = `Question: ${question}
Answer: ${answer}
Evaluate this interview answer and provide:
1. A score from 1-10 (where 10 is excellent)
2. Brief constructive feedback (2-3 sentences max)
3. Key strengths (1-2 points)
4. Areas for improvement (1-2 points)

Format:
Score: X/10
Feedback: [concise feedback]
Strengths: [strengths]
Improvements: [areas to improve]`
  const messages = [{ role: "user", content: prompt }]
  return await geminiAdaptor.handler({ messages })
}

export async function generateFollowUpQuestion(topic, level, previousQA) {
  const prompt = `Based on this previous Q&A in a ${level} level ${topic} interview:
Question: ${previousQA.question}
Answer: ${previousQA.answer}
Generate ONE natural follow-up question under 15 words.
Return ONLY the question.`
  const messages = [{ role: "user", content: prompt }]
  const response = await geminiAdaptor.handler({ messages })
  return response.replace(/^(Question:|Q:)\s*/i, "").replace(/\?+$/, "?").trim()
}

function normalizeQuestion(q) {
  return q.toLowerCase().replace(/[^\w\s]/g, "").trim().split(/\s+/).sort().join(" ")
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

function getQuestionsCount(duration) {
  if (duration <= 15) return 10
  if (duration <= 30) return 20
  if (duration <= 60) return 40
  return 60
}

export async function generateQuestionsForInterview(level, topic, duration) {
  const numQuestions = getQuestionsCount(duration)
  const seen = new Set()
  const questions = []
  let attempts = 0
  const maxAttempts = numQuestions * 3
  const delayBetweenRequestsMs = 3000
  while (questions.length < numQuestions && attempts < maxAttempts) {
    try {
      const q = await generateQuestion(level, topic, questions)
      const normalized = normalizeQuestion(q)
      if (!seen.has(normalized)) {
        seen.add(normalized)
        questions.push(q)
        console.log(`Generated (${questions.length}/${numQuestions}): ${q}`)
      }
    } catch (error) {
      console.error("Error generating question:", error.message)
    }
    attempts++
    await sleep(delayBetweenRequestsMs)
  }
  return questions
}

export const evalFlow = inngest.createFunction(
  { id: "evaluate-answer", name: "evaluateAnswer" },
  { event: "interview/answer" },
  async ({ event, step }) => {
    const { interviewId, question, answer, userId } = event.data
    const validatedData = await step.run("validate-input", async () => {
      if (!interviewId || !question || !answer) throw new Error("Missing required fields")
      return { interviewId, question, answer, userId }
    })
    const feedback = await step.run("generate-feedback", async () => {
      try {
        return await evaluateAnswer(validatedData.question, validatedData.answer)
      } catch (error) {
        console.error("Error generating feedback:", error)
        return "Unable to generate feedback at this time. Score: 5/10"
      }
    })
    const parsedFeedback = await step.run("parse-feedback", async () => {
      let score = 5
      const cleanFeedback = feedback.replace(/[^\w\s\-?.,:\n/()]/g, "").replace(/\s+/g, " ").trim()
      const scoreMatch = cleanFeedback.match(/Score:\s*(\d+)\/10/i)
      if (scoreMatch) score = Math.max(1, Math.min(10, parseInt(scoreMatch[1])))
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
    const result = await step.run("save-to-database", async () => {
      return await InterviewResult.findOneAndUpdate(
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
    })
    await step.run("send-notification", async () => {
      console.log(`✅ Evaluated answer for interview ${validatedData.interviewId}`)
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

export const triggerAnswerEvaluation = async (interviewId, question, answer, userId) => {
  await inngest.send({
    name: "interview/answer",
    data: { interviewId, question, answer, userId, timestamp: new Date().toISOString() },
  })
  console.log(`📤 Triggered evaluation for interview ${interviewId}`)
}
