import mongoose from "mongoose";
import Itinerary from "../models/itinerary.model.js";
import Activity from "../models/activity.model.js";
import Rating from "../models/rating.model.js";

// view all upcoming itineraries that are activated and not flagged
export const getUpcomingItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({
      isActivated: true, // itineraries that are deactivated do not appear to the user according to requirement (25)
      isFlagged: false, // itineraries that are flagged do not appear to the user according to requirement (33)
      availableDatesAndTimes: { $gt: Date.now() },
    })
      .populate("tourguideID")
      .populate("activities.activity")
      .populate("ratings");

    res.json(itineraries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
