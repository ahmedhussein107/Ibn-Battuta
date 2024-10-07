import Landmark from "../models/landmark.model.js";

import { genericSearch,buildFilter } from "../utilities/searchUtils.js";


export const createLandmark = async (req, res) => {
    try {
        const landmark = await Landmark.create(req.body);
        res.status(201).json(landmark);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const getAllLandmarks = async (req, res) => {
    try {
        const landmarks = await Landmark.find();
        res.status(200).json(landmarks);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const updateLandmark = async (req, res) => {
    try {
        const {
            governorID,
            description,
            pictures,
            location,
            tags,
            ticketPrices,
            openingHours,
            ...other
        } = req.body;

        const updatedTags =
            tags && tags.length > 0
                ? tags.split(",").map((tag) => tag.trim())
                : [];

        const updatedData = {
            ...other,
            governorID,
            description,
            pictures,
            location,
            tags: updatedTags,
            ticketPrices: ticketPrices || {
                foreigner: 0,
                native: 0,
                student: 0,
            },
            openingHours: openingHours || {}, // Default if undefined
        };

        const landmark = await Landmark.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!landmark) {
            return res.status(404).json({ error: "Landmark not found" });
        }

        res.status(200).json(landmark);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const getTicketPricesFromLandmark = async (req, res) => {
    try {
        const landmark = await Landmark.findById(req.params.id);
        if (!landmark) {
            return res.status(404).json({ error: "Landmark not found" });
        }
        res.status(200).json(landmark.ticketPrices);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const getLandmarkById = async (req, res) => {
    try {
        const landmark = await Landmark.findById(req.params.id);
        if (!landmark) {
            return res.status(404).json({ error: "Landmark not found" });
        }

        res.status(200).json(landmark);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const deleteLandmark = async (req, res) => {
    try {
        const landmark = await Landmark.findByIdAndDelete(req.params.id);
        if (!landmark) {
            return res.status(404).json({ error: "Landmark not found" });
        }
        res.status(200).json(landmark);
    } catch (e) {
        res.status(400).json({ error: e.message });
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
        const landmarks = await Landmark.find({ governorID: governorId });
        res.status(200).json(landmarks);
    } catch (error) {
        console.error("Error fetching landmarks:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const searchLandmarks = async (req, res) => {
    try {
        const results = await Landmark.find(buildFilter(req.query));
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
