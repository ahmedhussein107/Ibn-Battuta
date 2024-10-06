import Landmark from "../models/landmark.model.js";

import { genericSearch } from "../utilities/searchUtils.js";

export const createLandmark = async (req, res) => {
  try {
    const landmark = await Landmark.create(req.body);
    res.json(landmark);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const getAllLandmarks = async (req, res) => {
  try {
    const landmarks = await Landmark.find();
    res.json(landmarks);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const updateLandmark = async (req, res) => {
  try {
    const landmarks = await Landmark.findByIdAndUpdate(req.params.id, req.body);
    res.json(landmarks);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const getTicketPricesFromLandmark = async (req, res) => {
  try {
    const landmark = await Landmark.findById(req.params.id);
    if (!landmark) {
      res.status(404).json({ e: "Landmark not found" });
    } else {
      res.status(200).json(landmark.ticketPrices);
    }
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const getLandmarkById = async (req, res) => {
  try {
    const landmark = await Landmark.findById(req.params.id);
    if (landmark) {
      res.status(200).json(landmark);
    } else {
      res.status(404).json({ e: "Landmark not found" });
    }
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const deleteLandmark = async (req, res) => {
  try {
    const landmark = await Landmark.findByIdAndDelete(req.params.id);
    if (landmark) {
      res.status(200).json(landmark);
    } else {
      res.status(404).json({ e: "Landmark not found" });
    }
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const filterLandmarks = async (req, res) => {
  const { tags } = req.body;

  let query = {};

  if (tags) {
    query.tags = { $in: tags };
  }

  try {
    //console.log(query);
    const landmarks = await Landmark.find(query);
    res.status(200).json(landmarks);
  } catch (err) {
    console.error("Error fetching itineraries:", err);
    res.status(500).json({
      error: "An error occurred while fetching itineraries.",
      details: err.message,
    });
  }
};

export const getGovernorLandmarks = async (req, res) => {
  const governorId = req.params.id;
  try {
    const landmark = await Landmark.find({ governorID: governorId }); // Find all activities for the given advertiser ID
    res.status(200).json(landmark);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchLandmarks = async (req, res) => {
  try {
    const results = await genericSearch(Landmark, req.query);
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
