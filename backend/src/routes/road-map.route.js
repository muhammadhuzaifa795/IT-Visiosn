// import express from 'express';
// import {createRoadmap,getRoadmap} from "../controllers/roadmap.controller.js";

// const router = express.Router();

// router.post('/create-roadmap', createRoadmap);
// router.get('/get-roadmap/:userId', getRoadmap);


// export default router;





import express from "express";
import { createRoadmap, getRoadmap, deleteRoadmap } from "../controllers/roadmap.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-roadmap", protectRoute, createRoadmap);
router.get("/get-roadmap/:userId", protectRoute, getRoadmap);
router.delete("/delete-roadmap/:roadmapId", protectRoute, deleteRoadmap);

export default router;