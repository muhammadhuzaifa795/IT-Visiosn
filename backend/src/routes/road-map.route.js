import express from 'express';
import {createRoadmap,getRoadmap} from "../controllers/roadmap.controller.js";

const router = express.Router();

router.post('/create-roadmap', createRoadmap);
router.get('/get-roadmap/:userId', getRoadmap);


export default router;