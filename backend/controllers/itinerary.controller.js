import Itinerary from "../models/itinerary.model.js";
import Activity from "../models/activity.model.js";
import Booking from "../models/booking.model.js";
import TouristBookmark from "../models/touristBookmark.model.js";
import { genericSearch, buildFilter } from "../utilities/searchUtils.js";
import { sendNotificationToEmailAndSystem } from "./general.controller.js";
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
        const itinerary = await Itinerary.findById(req.params.id)
            .populate("tourguideID")
            .populate("activities.activity");
        if (itinerary) {
            res.status(200).json(itinerary);
        } else {
            res.status(404).json({ message: "Itinerary not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/** I want to make a function that returns the minimum no of free spot for an Itinrary
by taking minimum of free spots of all its activities */
export const getFreeSpotsHelper = async (id) => {
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

export const getFreeSpots = async (req, res) => {
    try {
        const id = req.params.id;
        const freeSpots = await getFreeSpotsHelper(id);
        res.status(200).json(freeSpots);
    } catch (error) {
        console.error("Error fetching free spots:", error);
        res.status(500).json({ message: "Internal Server Error" });
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
        const existingBookings = await Booking.countDocuments({
            typeId: req.params.id,
            bookingType: "Itinerary",
        });

        if (existingBookings > 0) {
            return res.status(400).json({
                message: `Cannot delete itinerary. There are ${existingBookings} active bookings for this itinerary.`,
            });
        }

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
    const { sortBy, page, limit, ...rest } = req.query;
    console.log("rest", rest);
    const _page = Math.max(1, parseInt(req.query.page) || 1);
    const _limit = Math.max(1, parseInt(req.query.limit) || 10);
    const toSkip = (_page - 1) * _limit;
    const query = buildFilter(rest);
    try {
        // Query the database with the constructed query object
        console.log(query);
        let itineraries = await Itinerary.find({
            isActivated: true, // itineraries that are deactivated do not appear to the user according to requirement (25)
            isFlagged: false, // itineraries that are flagged do not appear to the user according to requirement (33)
            startDate: { $gt: Date.now() },
            ...query,
        })
            .populate("tourguideID")
            .populate("activities.activity")
            .populate("ratings");

        if (sortBy) {
            if (sortBy === "priceAsc") {
                itineraries.sort((a, b) => a.price - b.price);
            } else if (sortBy === "priceDesc") {
                itineraries.sort((a, b) => b.price - a.price);
            } else if (sortBy === "ratingAsc") {
                itineraries.sort((a, b) => a.rating - b.rating);
            } else if (sortBy === "ratingDesc") {
                itineraries.sort((a, b) => b.rating - a.rating);
            }
        }
        const count = itineraries.length;
        itineraries = itineraries.slice(toSkip, Math.min(toSkip + _limit, count));
        return res.status(200).json({
            result: itineraries,
            totalPages: count > 0 ? Math.ceil(count / _limit) : 1,
        });
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
        console.log(itinerary);
        await itinerary.save();
        console.log("here after");

        await sendNotificationToEmailAndSystem(
            "Itinerary Flagged",
            `Your Itinerary ${itinerary.name} has been flagged as ${
                itinerary.isFlagged ? "not " : ""
            }appropriate`,
            itinerary.tourguideID,
            "TourGuide",
            itinerary._id,
            "Itinerary",
            itinerary.isFlagged ? "warning" : "info"
        );

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
        const itineraryID = req.params.id;
        const itinerary = await Itinerary.findById(itineraryID);
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }
        itinerary.isActivated = !itinerary.isActivated;
        if (itinerary.isActivated) {
            const tourists = await TouristBookmark.find({ bookmarkID: req.params.id });
            for (let tourist of tourists) {
                await sendNotificationToEmailAndSystem(
                    "Itinerary Activated",
                    `Your itinerary ${itinerary.name} is now activated`,
                    tourist.touristID,
                    "Tourist",
                    req.params.id,
                    "Itinerary"
                );
            }
        }
        await itinerary.save();
        res.status(200).json({
            message: "Itinerary activated status changed successfully",
            itinerary,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
