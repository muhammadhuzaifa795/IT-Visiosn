import express from 'express';
import { 
  createChatbotMessage,
  getChatById,
  getUserChats,
  updateChatTitle,
  deleteChat,
  getChatStats 
} from '../controllers/chatboat.controller.js';
import { validateChatInput, validateChatIdMiddleware, validateUserIdMiddleware } from '../middleware/validation.middleware.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/chatbot-message', protectRoute, validateChatInput, createChatbotMessage);
router.get('/chats/:chatId', protectRoute, validateChatIdMiddleware, getChatById);
router.get('/users/:userId/chats', protectRoute, validateUserIdMiddleware, getUserChats);
router.patch('/chats/:chatId/title', protectRoute, validateChatIdMiddleware, updateChatTitle);
router.delete('/chats/:chatId', protectRoute, validateChatIdMiddleware, deleteChat);
router.get('/users/:userId/stats', protectRoute, validateUserIdMiddleware, getChatStats);

export default router;