import mongoose from "mongoose"

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
      max: 120, // minutes
    },
    status: {
      type: String,
      enum: ["pending", "running", "ended", "cancelled"],
      default: "pending",
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    questions: [
      {
        question: String,
        answer: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Add index for better query performance
interviewSchema.index({ user: 1, createdAt: -1 })
interviewSchema.index({ status: 1 })

export default mongoose.model("Interview", interviewSchema)
