import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

import {
  getAllUsers,
  getAllPosts, getRoadMaps, getCvs, getInterviews, getTickets,
  deleteUser,
  getUserById,
  createUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protectRoute, isAdmin);

router.get("/users", getAllUsers);
router.get("/user/:id", getUserById);
router.delete("/user/:id", deleteUser);
router.post("/user", createUser);

router.get("/posts", getAllPosts);
router.get("/roadmaps" , getRoadMaps);
router.get("/cvs",  getCvs);
router.get("/interviews" , getInterviews);
router.get("/tickets",  getTickets);

export default router;
