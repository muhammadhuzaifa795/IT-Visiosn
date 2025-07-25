import InterviewResult from "../models/InterviewResult.js"

export const getResults = async (req, res) => {
  try {
    const { id } = req.params

    const result = await InterviewResult.findOne({ interview: id }).populate({
      path: "interview",
      populate: {
        path: "user",
        select: "name email",
      },
    })

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Interview results not found",
      })
    }

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error fetching interview results:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview results",
    })
  }
}

export const getAllResultsByUser = async (req, res) => {
  try {
    const { userId } = req.params

    const results = await InterviewResult.find()
      .populate({
        path: "interview",
        match: { user: userId },
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 })

    // Filter out results where interview is null (due to match condition)
    const filteredResults = results.filter((result) => result.interview !== null)

    res.json({
      success: true,
      data: filteredResults,
    })
  } catch (error) {
    console.error("Error fetching user interview results:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview results",
    })
  }
}
