// controllers/cvController.js
import CvGenerator from '../models/CvGenerator.js';
import * as cvService from '../services/cv.service.js';

export const generateCV = async (req, res) => {
  try {
    const cvData = req.body;
    if (req.user && req.user.userId !== cvData.userId) {
      return res.status(403).json({ error: 'Unauthorized user' });
    }
    const result = await cvService.generateCV(cvData);
    res.json(result);
  } catch (error) {
    console.error('Controller Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};



export async function getCV(req, res) {
  try {
    const userId = req.params.userId; // <-- Fix here

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const cv = await CvGenerator.find({ userId });

    if (!cv || cv.length === 0) {
      return res.status(404).json({ error: "No CV found for this user" });
    }

    res.status(200).json(cv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}




export const updateCV = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const cv = await CvGenerator.findById(id);
    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    if (req.user && req.user._id.toString() !== cv.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized user' });
    }

    const updatedCV = await CvGenerator.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    res.status(200).json(updatedCV);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete CV by ID
export const deleteCV = async (req, res) => {
  try {
    const { id } = req.params;

    const cv = await CvGenerator.findById(id);

    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    // Check ownership
    if (req.user && req.user.userId !== cv.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized user' });
    }

    await CvGenerator.findByIdAndDelete(id);

    res.status(200).json({ message: 'CV deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};