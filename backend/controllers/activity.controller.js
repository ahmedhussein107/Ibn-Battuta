import Activity from "../models/activity.model.js";

// view upcoming activities
export const getActivities = async (req, res) => { 
  
  try {
    const activities = await Activity.find({isOpenForBooking: true, isFlagged: false, startDate: {$gt: Date.now()}});
    res.json(activities);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
}