import express from "express"
import { getResults, getAllResultsByUser ,deleteResult} from "../controllers/result.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

// All routes require authentication
router.use(protectRoute)

// Get results for specific interview
router.get("/:id", getResults)

// Get all results for a user
router.get("/user/:userId", getAllResultsByUser)
router.delete("/delete/:userId", deleteResult)

export default router
