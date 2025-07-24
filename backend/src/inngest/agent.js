// agent.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createAgent } from '@inngest/agent-kit';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiAdaptor = {
  name: 'gemini',
  async handler({ messages }) {
    const prompt = messages.map(m => m.content).join('\n');
    const result = await genAI
      .getGenerativeModel({ model: 'gemini-1.5-flash' })
      .generateContent(prompt);
    return result.response.text();
  }
};

export const roadmapAgent = createAgent({
  name: 'roadmapBuilder',
  system:
    'You are a JSON generator. Return a valid JSON object with the structure: ' +
    '{"level":"beginner|intermediate|advanced","weeks":[{"week":1,"topics":["topic1","topic2"]},...,{"week":12,"topics":["topicN"]}]} ' +
    'as plain text. Do not include markdown, code fences (like ```json or ```), or any additional text before or after the JSON object.',
  model: geminiAdaptor
});