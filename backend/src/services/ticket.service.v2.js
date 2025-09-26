// services/ticket.service.v2.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const analyzeTicket = async (ticket) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a senior technical support triage agent. 
Analyze the ticket and return ONLY a valid JSON object with:

- summary: 1–2 sentence summary of the issue.
- priority: "low", "medium", or "high".
- helpfulNotes: Detailed explanation with causes and debugging steps. Do NOT include external links.
- relatedSkills: A single primary technical skill (as array with 1 element, e.g., ["Python"]).

Respond ONLY in JSON, no markdown or extra text.

Ticket information:
- Title: ${ticket.title}
- Description: ${ticket.description}
`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    let jsonString = raw;
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
    if (match) jsonString = match[1].trim();

    jsonString = jsonString.replace(/[\u0000-\u001F]+/g, "").replace(/\n/g, " ");

    try {
      const parsed = JSON.parse(jsonString);
      return {
        summary: parsed.summary || "No summary provided",
        priority: ["low", "medium", "high"].includes((parsed.priority || "").toLowerCase())
          ? parsed.priority.toLowerCase()
          : "medium",
        helpfulNotes: parsed.helpfulNotes || "Please manually review the ticket description and provide debugging instructions.",
        relatedSkills: Array.isArray(parsed.relatedSkills)
          ? parsed.relatedSkills.filter((s) => typeof s === "string")
          : [],
      };
    } catch {
      return {
        summary: "Unable to analyze ticket due to AI response error.",
        priority: "medium",
        helpfulNotes: "Please manually review the ticket description and provide debugging instructions.",
        relatedSkills: [],
      };
    }
  } catch {
    return {
      summary: "Unable to analyze ticket due to AI processing error.",
      priority: "medium",
      helpfulNotes: "Please manually review the ticket description and provide debugging instructions.",
      relatedSkills: [],
    };
  }
};

export default analyzeTicket;
