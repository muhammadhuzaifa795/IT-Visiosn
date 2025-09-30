import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a long, high-quality description in Markdown format.
 * Expands short/rough input into a detailed, fluent, structured article.
 *
 * @param {string} title - Title of the content
 * @param {string} description - Short or rough description
 * @returns {Promise<string>} - Generated markdown description
 */
export async function generateLongDesc(title, description) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
# Context
Title: ${title}
Description: ${description}

# Instructions
1. Clean and refine the inputs (may be in Roman Urdu or poorly written).
2. Expand the meaning with additional relevant context.
3. Generate a **well-structured Markdown article** with around 400–600 words (not excessively long).
4. Use **headings, subheadings, bullet points, numbered lists, and bold text** where helpful.
5. Ensure the content is fluent, professional, and human-readable.
6. ⚠️ Do NOT add meta text like "Here's an article" or "Based on your request".
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // 🧹 Clean unwanted intro phrases
    text = text.replace(/^here'?s.*?:/i, "").trim();

    // ✂️ Enforce max length (optional safeguard)
    const maxLength = 5000; // ~700–800 words
    if (text.length > maxLength) {
      text = text.substring(0, maxLength).trim() + "\n\n...(content truncated)";
    }

    if (!text || text.length < 200) {
      return "⚠️ AI failed to generate a proper description.";
    }

    return text;
  } catch (err) {
    console.error("Gemini generation error:", err.message);
    return "⚠️ AI failed to generate a proper description.";
  }
}


/**
 * Check if the given post is related to Information Technology.
 *
 * @param {string} title - Post title
 * @param {string} description - Post description
 * @param {string} attachmentName - File name (optional)
 * @param {string} mimeType - File type (optional)
 * @returns {Promise<boolean>} - true if IT relevant, else false
 */
export async function isITRelevant(title, description, attachmentName = '', mimeType = '') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Title: ${title}
Description: ${description}
Attachment Name: ${attachmentName}
Attachment Type: ${mimeType}

Determine if this is **Information Technology related** (e.g., programming, software, networking, databases, cloud, AI, education in IT).

Respond ONLY with "YES" or "NO".
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toUpperCase();

    return text === "YES";
  } catch (error) {
    console.error("IT relevance check error:", error.message);
    return false;
  }
}
