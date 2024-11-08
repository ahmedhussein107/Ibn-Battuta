import express from "express";
import {
    getItineraries,
    getUpcomingItineraries,
    getItineraryById,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    deleteItineraries,
    getTourGuideItinerary,
    searchItineraries,
    getFreeSpots,
    toggleFlaggedItineraries,
    toggleActivatedItineraries,
} from "../controllers/itinerary.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const itineraryRouter = express.Router();

itineraryRouter.post("/createItinerary", createItinerary);

itineraryRouter.patch("/updateItinerary/:id", updateItinerary);

itineraryRouter.delete("/deleteItinerary/:id", deleteItinerary);

itineraryRouter.get("/getAllItineraries", getItineraries);

itineraryRouter.get("/getItinerary/:id", getItineraryById);

itineraryRouter.get("/getUpcomingItineraries", getUpcomingItineraries);

itineraryRouter.get("/getTourGuideItinerary/", isAuthenticated, getTourGuideItinerary);

itineraryRouter.get("/searchItineraries", searchItineraries);

itineraryRouter.delete("/", deleteItineraries);

itineraryRouter.get("/getFreeSpots/:id", getFreeSpots);

itineraryRouter.patch("/toggleFlag/:id", toggleFlaggedItineraries);

itineraryRouter.patch("/toggleActive/:id", toggleActivatedItineraries);

export default itineraryRouter;
