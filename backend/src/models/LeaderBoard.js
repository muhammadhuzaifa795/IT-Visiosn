import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 20
  }
}, { timestamps: true });

const Leaderboard = mongoose.models.Leaderboard || mongoose.model("Leaderboard", leaderboardSchema);

export default Leaderboard;
