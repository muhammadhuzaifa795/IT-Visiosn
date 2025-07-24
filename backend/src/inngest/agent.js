import { GoogleGenerativeAI } from '@google/generative-ai';
import { createAgent } from '@inngest/agent-kit';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiAdaptor = {
  name: 'gemini',
  async handler({ messages }) {
    try {
      const prompt = messages.map(m => m.content).join('\n');
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API error:', error.message);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
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

export async function generateQuestion(level, topic) {
  try {
    if (!level || !topic || typeof level !== 'string' || typeof topic !== 'string') {
      throw new Error('Invalid level or topic');
    }
    const prompt = `Ask one ${level} level interview question on ${topic}.`;
    const messages = [{ role: 'user', content: prompt }];
    return await geminiAdaptor.handler({ messages });
  } catch (error) {
    console.error('Error generating question:', error.message);
    throw new Error(`Failed to generate question: ${error.message}`);
  }
}

export async function evaluateAnswer(q, a) {
  try {
    if (!q || !a || typeof q !== 'string' || typeof a !== 'string') {
      throw new Error('Invalid question or answer');
    }
    const prompt = `Q: ${q}\nA: ${a}\nRate 1-10 & short feedback`;
    const messages = [{ role: 'user', content: prompt }];
    return await geminiAdaptor.handler({ messages });
  } catch (error) {
    console.error('Error evaluating answer:', error.message);
    throw new Error(`Failed to evaluate answer: ${error.message}`);
  }
}