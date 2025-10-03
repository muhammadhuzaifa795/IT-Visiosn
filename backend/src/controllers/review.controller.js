import Review from "../models/Review.js";

// Add Review
export const addReview = async (req, res) => {
  try {
    const userId = req.user?._id; // authenticated user
    const { text, rating } = req.body;

    if (!text || !rating) {
      return res.status(400).json({ error: "Text and rating are required" });
    }

    const review = await Review.create({
      user: userId,
      text,
      rating,
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Get All Reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "fullName  profilePic") // sirf name/email dikhana
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Delete Review (optional - only admin ya owner)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // sirf owner ya admin delete kar sake
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
