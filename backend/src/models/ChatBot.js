import mongoose from "mongoose";

const chatBotSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
    messages: [
      {
        role: { 
          type: String, 
          enum: ["user", "assistant"], 
          required: true 
        },
        content: { 
          type: String, 
          required: true 
        },
        createdAt: { 
          type: Date, 
          default: Date.now 
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for better query performance
chatBotSchema.index({ userId: 1, createdAt: -1 });
chatBotSchema.index({ chatId: 1 });

const ChatBot = mongoose.model("ChatBot", chatBotSchema);
export default ChatBot;