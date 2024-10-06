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
import Itinerary from "../models/itinerary.model.js";

export const createItinerary = async (req, res) => {
  try {
    const itinerary = new Itinerary(req.body);
    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (itinerary) {
      res.status(200).json(itinerary);
    } else {
      res.status(404).json({ message: "Itinerary not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateItinerary = async (req, res) => {
  try {
    // Validate if ID is present and valid
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Itinerary ID" });
    }

    // Validate if the request body is not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }

    // Find and update the itinerary by ID
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // Ensures it returns the updated document and runs model validators
    );

    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Success response
    res.status(200).json(updatedItinerary);
  } catch (error) {
    console.error("Error updating itinerary:", error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};

export const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (itinerary) {
      res.status(200).json({ message: "Itinerary deleted successfully" });
    } else {
      res.status(404).json({ message: "Itinerary not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const filterItineraries = async (req, res) => {
  const { budget, date, preferences, language } = req.body;

  // Initialize an empty query object
  let query = {};

  // Add budget filter if provided
  if (budget) {
    query.price = { $lte: budget };
  }

  // Add date filter if provided
  if (date) {
    // Ensure date is a valid Date string
    const providedDate = new Date(date);

    // Check if the provided date is valid
    if (!isNaN(providedDate.getTime())) {
      // Match itineraries where any available date is greater than or equal to the provided date
      query.availableDatesAndTimes = { $gte: providedDate }; // Use $gte for filtering
    } else {
      return res.status(400).json({ message: "Invalid date provided." });
    }
  }
  // Add preferences filter if provided
  if (preferences) {
    query.tags = { $in: preferences };
  }

  // Add language filter if provided
  if (language) {
    query.language = { $in: language };
  }

  try {
    // Query the database with the constructed query object
    console.log(query);
    const itineraries = await Itinerary.find(query);

    // Return the filtered itineraries
    res.status(200).json(itineraries);
  } catch (err) {
    // Log error details
    console.error("Error fetching itineraries:", err);
    // Return error response
    res.status(500).json({
      error: "An error occurred while fetching itineraries.",
      details: err.message,
    });
  }
};
