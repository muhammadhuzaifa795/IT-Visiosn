import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
    {
        topic: String,
        duration: Number,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status: { type: String, enum: ["running", "ended"], default: "running" },
        level: { type: String, enum: ["easy", "medium", "hard"] },
    },
    {
        timestamps: true,
    }
)

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;