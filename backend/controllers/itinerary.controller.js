import Itinerary from "../models/Itinerary.model.js";

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
    query.date = { $gte: date };
  }

  // Add preferences filter if provided
  if (preferences) {
    query.preferences = { $in: preferences };
  }

  // Add language filter if provided
  if (language) {
    query.language = { $in: language };
  }

  try {
    // Query the database with the constructed query object
    const itineraries = await Itinerary.find(query);

    // Return the filtered itineraries
    res.status(200).json(itineraries);
  } catch (err) {
    // Handle any errors that occur during the query
    res
      .status(500)
      .json({ error: "An error occurred while fetching itineraries." });
  }
};
