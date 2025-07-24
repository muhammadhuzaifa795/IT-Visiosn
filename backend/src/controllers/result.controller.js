import InterviewResult from "../models/InterviewResult.js";


export const getResults = async (req, res) => {
    try {
        const result = await InterviewResult.find({ interview: req.params.id }).populate('interview');
        res.json(result);
    } catch (error) {
        console.error("Error fetching interview results:", error);
        res.status(500).json({ error: "Failed to fetch interview results" });
        
    }
}