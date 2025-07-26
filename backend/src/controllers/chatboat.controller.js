import ChatBot from "../models/ChatBoat.js"; 
import { chatbot } from "../services/chatbot.service.js";


export async function createChatbot(req, res) {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: "userId and message are required" });
    }

   
    const assistantResponse = await chatbot(message);

    let chat = await ChatBot.findOne({ userId, messages: { $size: 0 } }); 
    if (!chat) {
      chat = new ChatBot({ userId, messages: [] });
    }

    // Add user and assistant messages
    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "assistant", content: assistantResponse });

    await chat.save();

    return res.status(201).json({
      message: "Chat saved successfully",
      chatId: chat.chatId,
      firstMessage: chat.messages[0]?.content || null, 
    });
  } catch (error) {
    console.error("Error creating chatbot:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function getChatById(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await ChatBot.findOne({ chatId }).populate("userId", "username email");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({
      message: "Chat retrieved successfully",
      chatId: chat.chatId,
      firstMessage: chat.messages[0]?.content || null, 
      chat,
    });
  } catch (error) {
    console.error("Error retrieving chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserChats(req, res) {
  try {
    const { userId } = req.params;

    const chats = await ChatBot.find({ userId }).select("chatId messages.createdAt messages.content");

    if (!chats.length) {
      return res.status(404).json({ message: "No chats found for this user" });
    }

    const chatList = chats.map((chat) => ({
      chatId: chat.chatId,
      firstMessage: chat.messages[0]?.content || "No messages",
      createdAt: chat.messages[0]?.createdAt || chat.createdAt,
    }));

    return res.status(200).json({
      message: "User chats retrieved successfully",
      chats: chatList,
    });
  } catch (error) {
    console.error("Error retrieving user chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}