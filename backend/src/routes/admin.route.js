import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

// Example admin controller (placeholder, update as needed)
import {
  getAllUsers,
  deleteUser,
  getUserById,
} from "../controllers/admin.controller.js";

const router = express.Router();

// ✅ Protect all routes → only accessible by admin users
router.use(protectRoute, isAdmin);

// ✅ Routes
router.get("/users", getAllUsers); // Get list of all users
router.get("/user/:id", getUserById); // Get specific user details
router.delete("/user/:id", deleteUser); // Delete a user

export default router;
