import ChatBot from "../models/ChatBot.js";
import { chatbotService } from "../services/chatbot.service.js";
import { generateChatTitle } from "../lib/chatTitle.js";

export async function createChatbotMessage(req, res) {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ 
        success: false,
        message: "userId and message are required" 
      });
    }

    // Get AI response
    const assistantResponse = await chatbotService(message);

    // Find existing empty chat or create new one
    let chat = await ChatBot.findOne({ 
      userId, 
      messages: { $size: 0 },
      isActive: true 
    });

    if (!chat) {
      chat = new ChatBot({ 
        userId, 
        messages: [],
        title: generateChatTitle(message)
      });
    } else if (!chat.title) {
      // Set title if it doesn't exist
      chat.title = generateChatTitle(message);
    }

    // Add user and assistant messages
    chat.messages.push({ 
      role: "user", 
      content: message,
      createdAt: new Date()
    });
    
    chat.messages.push({ 
      role: "assistant", 
      content: assistantResponse,
      createdAt: new Date()
    });

    await chat.save();

    return res.status(201).json({
      success: true,
      message: "Chat message created successfully",
      chatId: chat.chatId,
      title: chat.title,
      firstMessage: chat.messages[0]?.content || null,
      newMessage: {
        role: "user",
        content: message,
        createdAt: chat.messages[chat.messages.length - 2]?.createdAt
      },
      assistantResponse: {
        role: "assistant",
        content: assistantResponse,
        createdAt: chat.messages[chat.messages.length - 1]?.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating chatbot message:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function getChatById(req, res) {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required"
      });
    }

    const chat = await ChatBot.findOne({ 
      chatId,
      isActive: true 
    }).populate("userId", "username email avatar");

    if (!chat) {
      return res.status(404).json({ 
        success: false,
        message: "Chat not found" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat retrieved successfully",
      chat: {
        chatId: chat.chatId,
        title: chat.title,
        userId: chat.userId,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }
    });
  } catch (error) {
    console.error("Error retrieving chat:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function getUserChats(req, res) {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const chats = await ChatBot.find({ 
      userId,
      isActive: true,
      messages: { $not: { $size: 0 } } // Only chats with messages
    })
    .select("chatId title messages createdAt updatedAt")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const totalChats = await ChatBot.countDocuments({ 
      userId,
      isActive: true,
      messages: { $not: { $size: 0 } }
    });

    if (!chats.length) {
      return res.status(200).json({
        success: true,
        message: "No chats found for this user",
        chats: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          totalChats: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }

    const chatList = chats.map((chat) => ({
      chatId: chat.chatId,
      title: chat.title || (chat.messages[0]?.content ? 
        generateChatTitle(chat.messages[0].content) : "New Chat"),
      firstMessage: chat.messages[0]?.content || "No messages",
      lastMessage: chat.messages[chat.messages.length - 1]?.content || "No messages",
      messageCount: chat.messages.length,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    }));

    return res.status(200).json({
      success: true,
      message: "User chats retrieved successfully",
      chats: chatList,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalChats / parseInt(limit)),
        totalChats,
        hasNextPage: skip + chats.length < totalChats,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error("Error retrieving user chats:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function updateChatTitle(req, res) {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    if (!chatId || !title) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and title are required"
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Title must be less than 100 characters"
      });
    }

    const chat = await ChatBot.findOneAndUpdate(
      { chatId, isActive: true },
      { title: title.trim() },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat title updated successfully",
      chat: {
        chatId: chat.chatId,
        title: chat.title
      }
    });
  } catch (error) {
    console.error("Error updating chat title:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required"
      });
    }

    // Soft delete - mark as inactive instead of removing
    const chat = await ChatBot.findOneAndUpdate(
      { chatId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
      chatId: chat.chatId
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function getChatStats(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const stats = await ChatBot.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), isActive: true } },
      {
        $group: {
          _id: null,
          totalChats: { $sum: 1 },
          totalMessages: { $sum: { $size: "$messages" } },
          avgMessagesPerChat: { $avg: { $size: "$messages" } }
        }
      }
    ]);

    const result = stats[0] || {
      totalChats: 0,
      totalMessages: 0,
      avgMessagesPerChat: 0
    };

    return res.status(200).json({
      success: true,
      message: "Chat statistics retrieved successfully",
      stats: result
    });
  } catch (error) {
    console.error("Error retrieving chat stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}