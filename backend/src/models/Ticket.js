    import mongoose from "mongoose";

    const ticketSchema = new mongoose.Schema({
        title: String,
        description: String,
        status: { type: String, default: "TODO" },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        assignedTo: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        }],
        attachments: {
            url: { type: String },
            public_id: { type: String }
        },
        priority: String,
        deadline: Date,
        helpfulNotes: String,
        relatedSkills: [String],
        solutions: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                solutionText: String,
                createdAt: { type: Date, default: Date.now }
            }
        ],
        createdAt: { type: Date, default: Date.now },
    });

    export default mongoose.model("Ticket", ticketSchema);