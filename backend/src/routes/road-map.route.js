


import express from "express";
import {
  createRoadmap,
  getRoadmap,
  deleteRoadmap,
} from "../controllers/roadmap.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import checkSubscription  from "../middleware/checkSubscription.middleware.js";

const router = express.Router();

router.post("/create-roadmap", protectRoute,checkSubscription, createRoadmap);
router.get("/get-roadmap/:userId", protectRoute, getRoadmap);
router.delete("/delete-roadmap/:roadmapId", protectRoute, deleteRoadmap);

export default router;
