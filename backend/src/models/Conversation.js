// models/Conversation.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  mode: { type: String, enum: ['text', 'voice'], default: 'text' }
});

const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  messages: [messageSchema],
}, {
  timestamps: true
});

export default mongoose.model('Conversation', conversationSchema);