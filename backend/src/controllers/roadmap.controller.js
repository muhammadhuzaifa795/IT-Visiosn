import RoadMap from "../models/RoadMap.js";
import { inngest } from '../inngest/client.js';

export async function createRoadmap(req, res) {
  try {
    const { goal } = req.body;
      const userId = req.user?._id;

    if (!goal) {
      return res.status(400).json({ message: "Goal is required" });
    }

    await inngest.send({
      name: 'user/goal.received',
      data: { userId: userId || req.user?._id || 'test-user', goal: goal.trim() }
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




export async function deleteRoadmap(req, res) {
    try {
        const { roadmapId } = req.params;
        const userId = req.user?._id;

        if (!roadmapId) {
            return res.status(400).json({ message: "Roadmap ID is required" });
        }

        const roadmap = await RoadMap.findById(roadmapId);
        if (!roadmap) {
            return res.status(404).json({ message: "Roadmap not found" });
        }

        if (roadmap.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own roadmaps" });
        }

        await RoadMap.findByIdAndDelete(roadmapId);
        res.json({ message: "Roadmap deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}




// createRoadmap.js
// import { inngest } from "../inngest/client.js";
// import RoadMap from "../models/RoadMap.js"

// export const createRoadmap = async (req, res) => {
//   try {
//     const { userId, goal } = req.body;

//     if (!userId || !goal) {
//       return res.status(400).json({ message: "userId and goal are required" });
//     }

//     // Create a minimal roadmap record with pending status
//     const roadmap = await RoadMap.create({
//       user: userId,
//       goal,
//       weeks: [],
//     });

//     // Trigger Inngest event
//     await inngest.send({
//       name: "roadmap/generate",
//       data: { roadmapId: roadmap._id, goal, userId },
//     });

//     res.status(201).json({
//       message: "Roadmap created successfully",
//       roadmapId: roadmap._id,
//     });
//   } catch (error) {
//     console.error("Error creating roadmap:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getRoadmap = async (req, res) => {
//   try {
//     const { userId } = req.params
//     const roadmaps = await RoadMap.find({ user: userId })
//     res.status(200).json(roadmaps)
//   } catch (error) {
//     console.error("Error fetching roadmaps:", error)
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// }

// export const deleteRoadmap = async (req, res) => {
//   try {
//     const { roadmapId } = req.params
//     const roadmap = await RoadMap.findById(roadmapId)
//     if (!roadmap) {
//       return res.status(404).json({ message: "Roadmap not found" })
//     }
//     if (roadmap.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized to delete this roadmap" })
//     }
//     await roadmap.deleteOne()
//     res.status(200).json({ message: "Roadmap deleted successfully" })
//   } catch (error) {
//     console.error("Error deleting roadmap:", error)
//     res.status(500).json({ message: "Server error", error: error.message })
//   }
// }











