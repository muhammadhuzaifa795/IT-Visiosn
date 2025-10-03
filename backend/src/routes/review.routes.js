import express from "express";
import { addReview, getReviews, deleteReview } from "../controllers/review.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET all reviews (public)
router.get("/", getReviews);

// POST add review (only logged in users)
router.post("/", protectRoute, addReview);

// DELETE review (owner or admin only)
router.delete("/:id", protectRoute, deleteReview);

export default router;
