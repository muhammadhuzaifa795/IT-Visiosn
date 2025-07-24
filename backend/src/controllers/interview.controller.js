import Interview from "../models/Interview.js";
import { generateQuestion } from "../inngest/agent.js";


export const createInterview = async (req, res) => {
  const { topic, level, duration } = req.body;
  const user = req.user._id; // From protectRoute middleware

  if (!topic || !level || !duration) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const interview = await Interview.create({
    user, // Use 'user' to match schema
    topic,
    level,
    duration,
  });

  res.status(201).json({
    data: {
      interviewId: interview._id.toString(), // Convert ObjectId to string
    },
  });
};

export async function getInterview(req, res) {
  try {
    const { userId } = req.params;
    const interviews = await Interview.find({ user: userId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    if (!interviews.length) return res.status(404).json({ message: "No interviews found" });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function startInterview(req, res) {
  try {
    await Interview.findByIdAndUpdate(req.params.id, { status: "running" });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function endInterview(req, res) {
  try {
    await Interview.findByIdAndUpdate(req.params.id, { status: "ended" });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function nextQuestion(req, res) {
  try {
    const { level, topic } = req.body;
    const next = await generateQuestion(level, topic);
    res.json({ next });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}