import express from "express";
import { askJarvisQuestion,getConversationHistory,deleteConversation } from "../controllers/jarvis.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/ask", protectRoute,askJarvisQuestion);
router.get("/conversations", protectRoute,getConversationHistory);
router.delete("/conversations/:sessionId", protectRoute, deleteConversation);

export default router;
