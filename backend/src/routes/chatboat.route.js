import express from 'express';
import { createChatbot, getChatById, getUserChats } from '../controllers/chatboat.controller.js';

const router = express.Router();

router.post('/chatbot-message', createChatbot);
router.get('/chats/:chatId', getChatById);
router.get('/users/:userId/chats', getUserChats);

export default router;