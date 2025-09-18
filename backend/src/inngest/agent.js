import { GoogleGenerativeAI } from "@google/generative-ai"
import { createAgent } from "@inngest/agent-kit"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiAdaptor = {
  name: "gemini",
  async handler({ messages }) {
    try {
      const prompt = messages.map((m) => m.content).join("\n");
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      const cleanedResponse = result.response
        .text()
        .replace(/\s+/g, " ")
        .trim();
      return cleanedResponse;
    } catch (error) {
      console.error("Gemini API error:", error.message);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  },
};


export const roadmapAgent = createAgent({
  name: "roadmapBuilder",
  system: `
You are a JSON generator. 
Generate a 12-week learning roadmap strictly as valid JSON. 
Use double quotes for all keys and string values. 
Do NOT include markdown, code fences, or any extra text. 
The JSON must follow this structure:

{
  "level": "beginner|intermediate|advanced",
  "weeks": [
    {"week":1,"topics":["topic1","topic2"]},
    {"week":2,"topics":["topic3","topic4"]},
    ...
    {"week":12,"topics":["topicN"]}
  ]
}
Return ONLY the JSON object as plain text.
`,
  model: geminiAdaptor,
});




/**
 * Generate a single interview question
 */
export async function generateQuestion(level, topic, previousQuestions = []) {
  try {
    if (!level || !topic || typeof level !== "string" || typeof topic !== "string") {
      throw new Error("Invalid level or topic")
    }

    let prompt = `Generate ONE short ${level} level interview question about ${topic}.
Keep it under 15 words and make it direct and clear.
Return ONLY the question, no additional text.`

    if (previousQuestions.length > 0) {
      prompt += `\n\nAvoid these topics already covered:\n${previousQuestions.join("\n")}`
    }

    const messages = [{ role: "user", content: prompt }]
    const response = await geminiAdaptor.handler({ messages })

    return response
      .replace(/^(Question:|Q:)\s*/i, "")
      .replace(/\?+$/, "?")
      .trim()
  } catch (error) {
    console.error("Error generating question:", error.message)
    throw new Error(`Failed to generate question: ${error.message}`)
  }
}

/**
 * Evaluate answer with AI feedback
 */
export async function evaluateAnswer(question, answer) {
  try {
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

Format your response as:
Score: X/10
Feedback: [brief feedback]
Strengths: [key strengths]
Improvements: [areas to improve]

Keep all sections concise and professional.`

    const messages = [{ role: "user", content: prompt }]
    return await geminiAdaptor.handler({ messages })
  } catch (error) {
    console.error("Error evaluating answer:", error.message)
    throw new Error(`Failed to evaluate answer: ${error.message}`)
  }
}

/**
 * Generate a learning roadmap
 */
export async function generateRoadmap(topic, level) {
  try {
    if (!topic || !level) {
      throw new Error("Topic and level are required")
    }

    const prompt = `Create a comprehensive 12-week learning roadmap for ${topic} at ${level} level.
Each week should have 3-4 specific topics to learn.
Return ONLY a valid JSON object with this exact structure:
{
  "level": "${level}",
  "topic": "${topic}",
  "weeks": [
    {"week": 1, "topics": ["topic1", "topic2", "topic3"]},
    {"week": 2, "topics": ["topic4", "topic5", "topic6"]},
    ...continue for all 12 weeks
  ]
}
Do not include any markdown formatting, code blocks, or additional text.`

    const messages = [{ role: "user", content: prompt }]
    const response = await geminiAdaptor.handler({ messages })

    try {
      const cleanedResponse = response.trim().replace(/```json|```/g, "")
      return JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("Failed to parse roadmap JSON:", parseError)
      console.error("Raw response:", response)
      throw new Error("Invalid JSON response from AI")
    }
  } catch (error) {
    console.error("Error generating roadmap:", error.message)
    throw new Error(`Failed to generate roadmap: ${error.message}`)
  }
}

/**
 * Generate a follow-up question
 */
export async function generateFollowUpQuestion(topic, level, previousQA) {
  try {
    const prompt = `Based on this previous Q&A in a ${level} level ${topic} interview:
Question: ${previousQA.question}
Answer: ${previousQA.answer}

Generate a short follow-up question (under 15 words) that:
1. Builds upon the previous answer
2. Tests deeper understanding
3. Is appropriate for ${level} level
4. Focuses on ${topic}

Return ONLY the question, no additional text.`

    const messages = [{ role: "user", content: prompt }]
    const response = await geminiAdaptor.handler({ messages })

    return response
      .replace(/^(Question:|Q:)\s*/i, "")
      .replace(/\?+$/, "?")
      .trim()
  } catch (error) {
    console.error("Error generating follow-up question:", error.message)
    throw new Error(`Failed to generate follow-up question: ${error.message}`)
  }
}

/**
 * Normalize a question for duplicate checking
 */
function normalizeQuestion(q) {
  return q
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim()
    .split(/\s+/)
    .sort()
    .join(" ")
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Duration → number of questions mapping
 */
function getQuestionsCount(duration) {
  if (duration <= 15) return 10
  if (duration <= 30) return 20
  if (duration <= 60) return 40
  return 60 // max cap
}

/**
 * Generate questions for interview based on duration
 */
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
      } else {
        console.log(`Duplicate skipped: ${q}`)
      }
    } catch (error) {
      console.error("Error generating question:", error.message)
    }

    attempts++
    await sleep(delayBetweenRequestsMs)
  }

  if (questions.length < numQuestions) {
    console.warn(`⚠️ Only generated ${questions.length}/${numQuestions} unique questions.`)
  }

  return questions
}
