// src/inngest/functions/roadmap.function.js
import { inngest } from "../client.js";
import { geminiAdaptor } from "../agent.js";
import RoadMap from "../../models/RoadMap.js";
import mongoose from "mongoose";

export const generateRoadmapFn = inngest.createFunction(
  { id: "generateRoadmap", retries: 2 },
  { event: "user/goal.received" },
  async ({ event }) => {
    const { userId, goal } = event.data;

    // Send goal to Gemini
    const raw = await geminiAdaptor.handler({
      messages: [
        {
          role: "user",
          content: `
Generate a 12-week learning roadmap for the goal: "${goal}".
Return strictly valid JSON with this structure:
{
  "level": "beginner|intermediate|advanced",
  "weeks": [
    {"week":1,"topics":["topic1","topic2"]},
    {"week":2,"topics":["topic3","topic4"]},
    ...
    {"week":12,"topics":["topicN"]}
  ]
}
Do NOT include markdown, code fences, or extra text. Only return the JSON object.
        `,
        },
      ],
    });

    // Clean any extra formatting
    const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

    let parsed;

    try {
      // Try JSON.parse first
      parsed = JSON.parse(cleaned);
    } catch (_) {
      // Fallback: manual parsing for pseudo-JSON
      try {
        // Extract level
        const levelMatch = cleaned.match(/level:\s*([a-zA-Z]+)/i);
        if (!levelMatch) throw new Error("Level not found");
        const level = levelMatch[1];

        // Extract weeks
        const weeksMatch = cleaned.match(/weeks:\s*(.+)/i);
        if (!weeksMatch) throw new Error("Weeks not found");

        const weeksRaw = weeksMatch[1]
          .split(/week:\s*\d+/i)
          .slice(1); // skip first empty

        const weeks = weeksRaw.map((w, i) => {
          const topics = w
            .replace(/topics:/i, "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
          return { week: i + 1, topics };
        });

        parsed = { level, weeks };
      } catch (error) {
        throw new Error(`Gemini returned unparseable response: ${error.message}`);
      }
    }

    // Validate structure
    if (!parsed.level || !parsed.weeks || !Array.isArray(parsed.weeks)) {
      throw new Error("Parsed data has invalid structure");
    }

    const { level, weeks } = parsed;

    // Save to MongoDB
    await RoadMap.create({
      user: new mongoose.Types.ObjectId(userId),
      goal,
      level,
      weeks,
    });

    return { userId, level, weeks };
  }
);






// import { inngest } from '../client.js';
// import { geminiAdaptor } from '../agent.js';
// import RoadMap from '../../models/RoadMap.js';
// import mongoose from 'mongoose';

// export const generateRoadmapFn = inngest.createFunction(
//   { id: 'generateRoadmap', retries: 2 },
//   { event: 'user/goal.received' },
//   async ({ event }) => {
//     const { userId, goal } = event.data;

//     // Check if roadmap already exists to avoid duplicate processing
//     const existingRoadmap = await RoadMap.findOne({ user: userId, goal });
//     if (existingRoadmap) {
//       return {
//         _id: existingRoadmap._id.toString(),
//         user: existingRoadmap.user.toString(),
//         goal: existingRoadmap.goal,
//         level: existingRoadmap.level,
//         weeks: existingRoadmap.weeks,
//         createdAt: existingRoadmap.createdAt,
//       };
//     }

//     const prompt = `Generate a 12-week learning roadmap for the goal: "${goal}". Return a valid JSON object with the structure: {"level":"beginner|intermediate|advanced","weeks":[{"week":1,"topics":["topic1","topic2"]},...,{"week":12,"topics":["topicN"]}]} as plain text. Do not include markdown, code fences (like \`\`\`json or \`\`\`), or any additional text before or after the JSON object.`;

//     const raw = await geminiAdaptor.handler({
//       messages: [{ role: 'user', content: prompt }]
//     });

//     const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

//     let parsed;
//     try {
//       parsed = JSON.parse(cleaned);
//       if (!parsed.level || !parsed.weeks || !Array.isArray(parsed.weeks)) {
//         throw new Error('Invalid JSON structure');
//       }
//     } catch (error) {
//       throw new Error(`Gemini did not return valid JSON: ${error.message}`);
//     }

//     const { level, weeks } = parsed;

//     const roadmap = await RoadMap.create({
//       user: new mongoose.Types.ObjectId(userId),
//       goal,
//       level,
//       weeks,
//       createdAt: new Date(),
//     });

//     return {
//       _id: roadmap._id.toString(),
//       user: roadmap.user.toString(),
//       goal: roadmap.goal,
//       level: roadmap.level,
//       weeks: roadmap.weeks,
//       createdAt: roadmap.createdAt,
//     };
//   }
// );