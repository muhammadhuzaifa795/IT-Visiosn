// models/CV.js
import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  linkedin: { type: String },
  skills: [{ type: String }],
  experience: [{
    company: String,
    role: String,
    duration: String,
    description: String,
  }],
  education: [{
    institution: String,
    degree: String,
    year: String,
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: String,
  }],
  generatedCV: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('CV', cvSchema);