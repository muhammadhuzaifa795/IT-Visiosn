import mongoose from "mongoose"

const answerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
  },
  score: {
    type: Number,
    min: 1,
    max: 10,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const interviewResultSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      unique: true,
    },
    answers: [answerSchema],
    overallScore: {
      type: Number,
      min: 0,
      max: 10,
    },
    overallFeedback: {
      type: String,
    },
    strengths: [String],
    improvements: [String],
  },
  {
    timestamps: true,
  },
)

// Calculate overall score when answers are updated
interviewResultSchema.pre("save", function (next) {
  if (this.answers && this.answers.length > 0) {
    const scores = this.answers.filter((a) => a.score).map((a) => a.score)
    if (scores.length > 0) {
      this.overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
    }
  }
  next()
})

export default mongoose.model("InterviewResult", interviewResultSchema)
