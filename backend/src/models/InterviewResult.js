import mongoose from "mongoose";

const ans = new mongoose.Schema({ question: String, answer: String, feedback: String });

const interviewResultSchema = new mongoose.Schema(
    {
        interview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interview',
            required: true
        },
        answers:[ans]
    }
)

const InterviewResult = mongoose.model('InterviewResult', interviewResultSchema);

export default InterviewResult;