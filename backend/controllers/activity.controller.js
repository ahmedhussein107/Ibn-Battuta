import Activity from "../models/activity.model.js";

// view upcoming activities that are open for booking and are not flagged
export const getUpcomingActivities = async (req, res) => { 
  
  try {
    const activities = await Activity.find({isOpenForBooking: true, isFlagged: false, startDate: {$gt: Date.now()}});
    res.json(activities);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};