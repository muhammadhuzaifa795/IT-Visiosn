import express, { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { aiResponse } from "../controllers/ai.controller.js";
import checkSubscription  from "../middleware/checkSubscription.middleware.js";

const router = express.Router();

router.use(protectRoute)

router.post('/get-response',checkSubscription,aiResponse)


export default router