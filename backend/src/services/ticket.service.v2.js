// services/ticket.service.v2.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const analyzeTicket = async (ticket) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `You are a senior technical support triage agent. 
Analyze the ticket carefully and return a JSON object with:

- summary: A short 1–2 sentence summary of the issue.
- priority: One of "low", "medium", or "high".
- helpfulNotes: Detailed explanation including causes, debugging steps, and at least one resource.
- relatedSkills: A single primary technical skill needed to address the ticket (as an array with 1 element, e.g., ["Python"])

⚠️ Respond ONLY in valid JSON. No markdown or extra text.

Example format:

{
  "summary": "User cannot connect to MongoDB from Node.js.",
  "priority": "high",
  "helpfulNotes": "Connection issues in Node.js with MongoDB can occur due to incorrect URI, firewall rules, or network latency. Steps: (1) Verify your connection string, (2) Ensure MongoDB server is running, (3) Check firewall rules and port 27017. See https://www.mongodb.com/docs/manual and https://mongoosejs.com/docs/",
  "relatedSkills": ["Node.js"]
}

--- 

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
      return JSON.parse(jsonString);
    } catch {
      return {
        summary: "Unable to analyze ticket due to AI response error.",
        priority: "medium",
        helpfulNotes: "Please manually review the ticket description and provide detailed debugging instructions.",
        relatedSkills: [],
      };
    }
  } catch {
    return {
      summary: "Unable to analyze ticket due to AI processing error.",
      priority: "medium",
      helpfulNotes: "Please manually review the ticket description and provide detailed debugging instructions.",
      relatedSkills: [],
    };
  }
};

export default analyzeTicket;
