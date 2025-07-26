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
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }, // Timestamp for each message
      },
    ],
  },
  { timestamps: true }
);

const ChatBot = mongoose.model("ChatBot", chatBotSchema);
export default ChatBot;