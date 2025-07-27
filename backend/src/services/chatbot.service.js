import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export const chatbotService = async (message, conversationHistory = []) => {
  try {
    // Prepare messages for Google Gemini API
    const messages = [
      {
        role: 'model',
        parts: [{
          text: `You are a helpful AI assistant. You can help with coding, general questions, creative writing, and more. 
          When providing code examples, use proper markdown formatting with language-specific code blocks.
          Be concise but thorough in your responses. If you're providing code, include comments to explain complex parts.`
        }],
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const result = await model.generateContent({
      contents: messages,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.1,
        topK: 1,
      },
    });

    return result.response.text();
  } catch (error) {
    console.error('Google Gemini API Error:', error);

    // Fallback responses for different error types
    if (error.status === 429) {
      return 'I’m receiving too many requests right now. Please wait a moment and try again.';
    } else if (error.status === 403) {
      return 'I apologize, but I’m currently experiencing high demand or quota issues. Please try again in a few moments.';
    } else {
      return 'I apologize, but I’m having trouble processing your request right now. Please try again later.';
    }
  }
};

// Alternative service for when Google Gemini is not available
export const fallbackChatbotService = async (message) => {
  // Simple rule-based responses for demonstration
  const responses = {
    greeting: [
      'Hello! How can I help you today?',
      'Hi there! What would you like to know?',
      'Greetings! I’m here to assist you.',
    ],
    coding: [
      'I’d be happy to help you with coding! Could you provide more details about what you’re working on?',
      'Programming questions are my specialty! What language or framework are you using?',
      'Let me help you with that code. Can you share more context about the problem?',
    ],
    default: [
      'That’s an interesting question! Let me think about that...',
      'I understand you’re asking about that topic. Could you provide more specific details?',
      'Thanks for your question! I’ll do my best to help you with that.',
    ],
  };

  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  } else if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('javascript') || lowerMessage.includes('python')) {
    return responses.coding[Math.floor(Math.random() * responses.coding.length)];
  } else {
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }
};

// Export the main service
export const chatbot = chatbotService;