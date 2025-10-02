import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  originalFilename: { type: String },
  text: { type: String },
  jobDescription: { type: String, default: "" },
  aiResult: {
    parsed: { type: mongoose.Schema.Types.Mixed, default: null },
    raw: { type: String, default: "" }
  },
  tags: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model("Report", ReportSchema);