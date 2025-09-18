// services/cvService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import CV from '../models/CvGenerator.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Helper: Format array to markdown list
const formatList = (arr) => Array.isArray(arr) && arr.length ? arr.map(item => `- ${item}`).join('\n') : '- None';

// Helper: Retry wrapper for API calls
const retryGenerateContent = async (prompt, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.text || (await result.response.text());
    } catch (error) {
      if (error.message.includes('503') && i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error;
      }
    }
  }
};

export const generateAICV = async (cvData) => {
  const {
    userId,
    name,
    email,
    phone = 'N/A',
    linkedin = 'N/A',
    skills = [],
    experience = [],
    education = [],
    certifications = [],
  } = cvData;

  // Validate required fields
  if (!userId || !name || !email) {
    throw new Error('Missing required fields: userId, name, and email are mandatory');
  }

  // Dynamic prompt for CV generation
  const prompt = `
Generate a professional CV in markdown format for an IT professional with the following details:
- **Name**: ${name}
- **Email**: ${email}
- **Phone**: ${phone}
- **LinkedIn**: ${linkedin}
- **Skills**:
${formatList(skills)}
- **Experience**:
${formatList(experience)}
- **Education**:
${formatList(education)}
- **Certifications**:
${formatList(certifications)}

**Instructions**:
- Create a well-structured CV tailored for an IT role (e.g., software developer, DevOps engineer).
- Include sections: Summary, Skills, Experience, Education, and Certifications.
- Ensure the tone is professional, concise, and highlights relevant IT expertise.
- Handle any input size gracefully, even if lists are empty or extensive.
  `.trim();

  try {
    const generatedCV = await retryGenerateContent(prompt);

    // Save CV to database
    const cv = new CV({
      userId,
      name,
      email,
      phone,
      linkedin,
      skills,
      experience,
      education,
      certifications,
      generatedCV,
    });
    await cv.save();

    return { cv: generatedCV, cvId: cv._id };
  } catch (error) {
    throw new Error(`Failed to generate CV: ${error.message}`);
  }
};

export const getCVByUserId = async (userId) => {
  const cv = await CV.findOne({ userId });
  if (!cv) {
    throw new Error('CV not found for this user');
  }
  return cv;
};