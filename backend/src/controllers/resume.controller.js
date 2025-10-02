import fs from "fs"
import extract from "pdf-text-extract"
import Report from "../models/Report.js"
import { analyzeResumeWithGemini } from "../services/resume.service.js"

const extractText = (filePath) =>
  new Promise((resolve, reject) => {
    extract(filePath, (err, pages) => {
      if (err) reject(err)
      else resolve(pages.join("\n"))
    })
  })

export const uploadResume = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" })
    }

    const filePath = req.file.path
    const extractedText = await extractText(filePath)
    const jobDescription = req.body.jobDescription || ""
    const aiResult = await analyzeResumeWithGemini(extractedText, jobDescription)
    const { parsed = {}, raw = "" } = aiResult

    const report = new Report({
      user: userId,
      originalFilename: req.file.originalname,
      filePath,
      text: extractedText,
      jobDescription,
      aiResult: parsed || raw,
      tags: parsed.suggestedTags || [],
    })

    await report.save()
    return res.status(201).json({ success: true, report })
  } catch (err) {
    console.error("Upload error:", err)
    return res.status(500).json({ error: "Failed to process resume" })
  }
}

export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body
    if (!resumeText) {
      return res.status(400).json({ error: "resumeText is required" })
    }
    const aiResult = await analyzeResumeWithGemini(resumeText, jobDescription || "")
    res.json({ success: true, aiResult })
  } catch (err) {
    console.error("Analyze error:", err)
    res.status(500).json({ error: "AI analysis failed" })
  }
}

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(reports)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" })
  }
}

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!report) {
      return res.status(404).json({ error: "Report not found" })
    }
    res.json(report)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch report" })
  }
}
