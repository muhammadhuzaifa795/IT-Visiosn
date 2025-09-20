import express from "express"
import {protectRoute} from "../middleware/auth.middleware.js"
import { addLeaderboardEntry, getLeaderboard } from "../controllers/leaderboard.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(protectRoute)


router.get('/leaderboard-get',getLeaderboard)
router.post('/adduser-leaderboard-post',addLeaderboardEntry)


export default router;