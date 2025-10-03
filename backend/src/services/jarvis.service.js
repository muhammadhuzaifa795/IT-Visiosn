import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Updated to a stable model

/**
 * Fetch response from Gemini AI
 * @param {string} prompt - The user question with optional user data
 * @returns {Promise<string>} - AI-generated response
 */
export const fetchJarvisResponse = async (prompt) => {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    });

    // Safely extract the first candidate's content
    const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I cannot respond right now.";
    return responseText;
  } catch (err) {
    console.error("Gemini AI error:", err.message || err);
    throw new Error("Failed to fetch response from AI");
  }
};