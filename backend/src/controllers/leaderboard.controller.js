import Leaderboard from "../models/LeaderBoard.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

// Add user-ticket entry to leaderboard
export const addLeaderboardEntry = async (req, res) => {
  try {
    const { userId, ticketId } = req.body;

    const existingEntry = await Leaderboard.findOne({ user: userId, ticket: ticketId });
    if (existingEntry) return res.status(400).json({ message: "User already has this ticket in leaderboard" });

    const leaderboardEntry = await Leaderboard.create({ user: userId, ticket: ticketId, points: 20 });

    // Update ticket status to completed
    await Ticket.findByIdAndUpdate(ticketId, { status: "completed" });

    res.status(201).json({ success: true, leaderboardEntry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Fetch aggregated leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.aggregate([
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: "$points" },
          tickets: { $push: "$ticket" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          fullName: "$user.fullName",
          profilePic: "$user.profilePic",
          totalPoints: 1,
          tickets: 1
        }
      },
      { $sort: { totalPoints: -1 } }
    ]);

    res.status(200).json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
