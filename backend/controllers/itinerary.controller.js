import Itinerary from "../models/itinerary.model.js";
import Activity from "../models/activity.model.js";
import { genericSearch, buildFilter } from "../utilities/searchUtils.js";

export const createItinerary = async (req, res) => {
    req.body.tourguideID = req.user.userId;
    try {
        const itinerary = new Itinerary(req.body);
        await itinerary.save();
        res.status(201).json(itinerary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getItineraries = async (req, res) => {
    const query = buildFilter(req.query);
    try {
        const itineraries = await Itinerary.find(query);
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.deleteMany(req.body);
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getItineraryById = async (req, res) => {
    try {
        console.log("I am here");
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
// I want to make a function that returns the minimum no of free spot for an Itinrary by taking minimum of free spots of all its activities
export const getFreeSpots = async (id) => {
    try {
        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            throw new Error("Itinerary not found");
        }

        let mn = 1e9 + 7;
        const activities = itinerary.activities;

        for (const object of activities) {
            if (object.activityType === "Activity") {
                const activityInfo = await Activity.findById(object.activity);
                mn = Math.min(mn, activityInfo.freeSpots);
            } else if (object.activityType === "CustomActivity") {
                // Handle CustomActivity if needed
            }
        }

        return mn;
    } catch (error) {
        throw new Error(error.message); // Return error to the caller
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

export const getUpcomingItineraries = async (req, res) => {
    const query = buildFilter(req.query);

    try {
        // Query the database with the constructed query object
        console.log(query);
        const itineraries = await Itinerary.find({
            isActivated: true, // itineraries that are deactivated do not appear to the user according to requirement (25)
            isFlagged: false, // itineraries that are flagged do not appear to the user according to requirement (33)
            availableDatesAndTimes: { $gt: Date.now() },
            ...query,
        })
            .populate("tourguideID")
            .populate("activities.activity")
            .populate("ratings");

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

export const getTourGuideItinerary = async (req, res) => {
    const query = buildFilter(req.query);
    const tourguideId = req.user.userId;
    try {
        const itineraries = await Itinerary.find({ tourguideID: tourguideId, ...query }); // Find all activities for the given advertiser ID
        res.status(200).json(itineraries);
    } catch (error) {
        console.error("Error fetching itineraries:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const searchItineraries = async (req, res) => {
    try {
        const results = await genericSearch(Itinerary, req.query);
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleFlaggedItineraries = async (req, res) => {
    try {
        const itineraryID = req.params.id;
        const itinerary = await Itinerary.findById(itineraryID);
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }
        itinerary.isFlagged = !itinerary.isFlagged;
        await itinerary.save();
        res.status(200).json({
            message: "Itinerary flagged status changed successfully",
            itinerary,
        });

        // to be continued?
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleActivatedItineraries = async (req, res) => {
    try {
        console.log("1");
        const itineraryID = req.params.id;
        console.log("2");
        const itinerary = await Itinerary.findById(itineraryID);
        console.log("3");
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }
        console.log("4");
        itinerary.isActivated = !itinerary.isActivated;
        console.log("5");
        await itinerary.save();
        console.log("6");
        res.status(200).json({
            message: "Itinerary activated status changed successfully",
            itinerary,
        });
        console.log("7");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
