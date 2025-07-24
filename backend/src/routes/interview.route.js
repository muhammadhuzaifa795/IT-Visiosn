// src/routes/interview.routes.js
import express from "express";
import {
  createInterview,
  getInterview,
  startInterview,
  endInterview,
  nextQuestion
} from "../controllers/interview.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createInterview);           // POST /interview
router.get("/user/:userId", protectRoute, getInterview);   // GET /interview/user/:userId
router.patch("/:id/start", protectRoute, startInterview);  // PATCH /interview/:id/start
router.patch("/:id/end", protectRoute, endInterview);      // PATCH /interview/:id/end
router.post("/next-question", protectRoute, nextQuestion); // POST /interview/next-question

export default router;