// services/cvService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import CV from '../models/CvGenerator.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });


export const generateCV = async (cvData) => {
  const {
    userId,
    name,
    email,
    phone,
    linkedin,
    skills = [],
    experience = [],
    education = [],
    certifications = [],
  } = cvData;

  if (!userId || !name || !email) {
    throw new Error('Missing required fields');
  }

  // Convert arrays to string for prompt in bullet form (optional)
  const formatList = (arr) => arr.map(item => `- ${item}`).join('\n');

  const prompt = `
    Generate a professional CV in markdown format for an IT professional with the following details:
    - Name: ${name}
    - Email: ${email}
    - Phone: ${phone || 'N/A'}
    - LinkedIn: ${linkedin || 'N/A'}
    - Skills:
      ${formatList(skills)}
    - Experience:
      ${formatList(experience)}
    - Education:
      ${formatList(education)}
    - Certifications:
      ${formatList(certifications)}
    
    Ensure the CV is well-structured, professional, and tailored for an IT role (e.g., software developer, DevOps engineer). Include sections for Summary, Skills, Experience, Education, and Certifications.
  `;

  try {
    const result = await model.generateContent(prompt);
    // Adjust this based on actual API response shape
    const generatedCV = result.text || (await result.response.text());

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
    throw new Error('CV not found');
  }
  return cv;
};