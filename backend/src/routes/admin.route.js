

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

// Controllers
import {
  getAllUsers,
  deleteUser,
  getUserById,
  createUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

// ✅ Protect all routes → only accessible by admin users
router.use(protectRoute, isAdmin);

// ✅ Routes
router.get("/users", getAllUsers); // Get list of all users
router.get("/user/:id", getUserById); // Get specific user details
router.delete("/user/:id", deleteUser); // Delete a user
router.post("/user", createUser); // Create a new user

export default router;