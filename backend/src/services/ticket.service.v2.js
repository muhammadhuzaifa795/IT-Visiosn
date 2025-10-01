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

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      parsed = {};
    }

    const summary = parsed.summary || "No summary provided";
    const priority = ["low", "medium", "high"].includes((parsed.priority || "").toLowerCase())
      ? parsed.priority.toLowerCase()
      : "medium";
    const helpfulNotes =
      parsed.helpfulNotes ||
      "Please manually review the ticket description and provide debugging instructions.";

    // ✅ Clean related skill names
    const normalizeSkill = (skill) => {
      if (!skill || typeof skill !== "string") return null;
      return skill
        .replace(/programming|language|framework|library|tech/gi, "") // remove unwanted suffix
        .replace(/\s+/g, " ") // extra spaces
        .trim();
    };

    const relatedSkills = Array.isArray(parsed.relatedSkills)
      ? parsed.relatedSkills.map(normalizeSkill).filter((s) => s)
      : [];

    // ✅ Markdown formatted output
    const markdownReport = `
### 📝 Ticket Analysis Report

- **Summary:** ${summary}
- **Priority:** ${priority.toUpperCase()}
- **Helpful Notes:**
  ${helpfulNotes.split(". ").map((n) => `  - ${n}`).join("\n")}
- **Related Skills:** ${relatedSkills.length ? relatedSkills.join(", ") : "None"}
`;

    return {
      summary,
      priority,
      helpfulNotes,
      relatedSkills,
      markdownReport,
    };
  } catch {
    return {
      summary: "Unable to analyze ticket due to AI processing error.",
      priority: "medium",
      helpfulNotes:
        "Please manually review the ticket description and provide debugging instructions.",
      relatedSkills: [],
      markdownReport: `
### ⚠️ Ticket Analysis Failed
- **Summary:** Unable to analyze ticket due to AI processing error.
- **Priority:** MEDIUM
- **Helpful Notes:** Please manually review the ticket description and provide debugging instructions.
- **Related Skills:** None
`,
    };
  }
};

export default analyzeTicket;
