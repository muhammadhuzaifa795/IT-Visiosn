import RoadMap from "../models/RoadMap.js";
import { inngest } from '../inngest/client.js';

export async function createRoadmap(req, res) {
  try {
    const { data } = req.body;
    const { text, userId } = data || {};

    if (!text) {
      return res.status(400).json({ message: "Goal is required" });
    }

    await inngest.send({
      name: 'user/goal.received',
      data: { userId: userId || req.user?._id || 'test-user', goal: text.trim() }
    });

    res.json({ message: 'Roadmap generation started' });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getRoadmap(req, res) {
    try {
        const { userId } = req.params;
        const roadmap = await RoadMap.find({ user: userId }).populate('user', 'name email');
        if (!roadmap) {
            return res.status(404).json({ message: "Roadmap not found" });
        }
        res.json(roadmap);
    
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        
    }
}