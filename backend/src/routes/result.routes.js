import express from "express";
import { getResults } from "../controllers/result.controller.js";
// import auth from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/:id",  getResults);
export default router;