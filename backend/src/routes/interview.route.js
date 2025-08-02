// import express from "express"
// import {
//   createInterview,
//   getInterview,
//   startInterview,
//   endInterview,
//   submitAnswer,
// } from "../controllers/interview.controller.js"
// import { protectRoute } from "../middleware/auth.middleware.js"

// const router = express.Router()

// // All routes require authentication
// router.use(protectRoute)

// // Create new interview
// router.post("/", createInterview)

// // Get interviews by user
// router.get("/user/:userId", getInterview)

// // Start interview
// router.patch("/:id/start", startInterview)

// // End interview
// router.patch("/:id/end", endInterview)

// // Submit answer
// router.post("/answer", submitAnswer)

// export default router









import express from "express"
import {
  createInterview,
  getInterviews, // Changed from getInterview
  startInterview,
  endInterview,
  submitAnswer,
  deleteInterview,
} from "../controllers/interview.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

// All routes require authentication
router.use(protectRoute)

// Create new interview
router.post("/", createInterview)

// Get interviews by user
router.get("/user/:userId", getInterviews) // Changed from getInterview

// Start interview
router.patch("/:id/start", startInterview)

// End interview
router.patch("/:id/end", endInterview)

// Submit answer
router.post("/answer", submitAnswer)

// New: Delete route for interviews
router.delete("/:id", deleteInterview)

export default router
