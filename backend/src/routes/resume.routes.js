import express from "express";
import multer from "multer";
import { uploadResume, analyzeResume, getReports, getReportById } from "../controllers/resume.controller.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadResume);
router.post("/:id/analyze", analyzeResume);
router.get("/", getReports);
router.get("/:id", getReportById);

export default router;
