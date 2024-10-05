import Itinerary from "../models/itinerary.model.js";

// view all upcoming itineraries that are activated and not flagged
export const getUpcomingItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({isActivated: true, isFlagged: false, availableDatesAndTimes: {$gt: Date.now()}}); // looping over the dates to check if any are in the future
    res.json(itineraries);
  }
  catch (error) {
    res.status(400).json({error: error.message});
  }
};