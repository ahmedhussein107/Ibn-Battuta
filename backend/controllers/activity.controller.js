import Activity from "../models/activity.model.js";

// view upcoming activities that are open for booking and are not flagged
export const getUpcomingActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      isFlagged: false, // activities that are flagged do not appear to the user according to requirement (33)
      startDate: { $gt: Date.now() },
    })
      .populate("advertiserID")
      .populate("ratings");
    res.json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
