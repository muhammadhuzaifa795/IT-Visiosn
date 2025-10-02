
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" })

export async function analyzeResumeWithGemini(text, jobDescription = "") {
  const prompt = `
You are an expert recruiter assistant.
Analyze the RESUME and JOB DESCRIPTION, and return valid JSON with:
- matchPercentage (0-100)
- missingSkills (array of strings)
- strengths (array of strings)
- shortSummary (string)
- suggestedTags (array of strings)

RESUME:
${text}

JOB DESCRIPTION:
${jobDescription}
`
  const result = await model.generateContent(prompt)
  const raw = result.response.text()
  let parsed = null
  try {
    parsed = JSON.parse(raw.match(/{[\s\S]*}/)?.[0] || "{}")
  } catch (err) {
    console.error("Gemini JSON parse error:", err)
  }
  return { parsed, raw }
}
