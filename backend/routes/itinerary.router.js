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
    toggleFlaggedItineraries,
} from "../controllers/itinerary.controller.js";

const itineraryRouter = express.Router();

itineraryRouter.post("/createItinerary", createItinerary);

itineraryRouter.patch("/updateItinerary/:id", updateItinerary);

itineraryRouter.delete("/deleteItinerary/:id", deleteItinerary);

itineraryRouter.get("/getAllItineraries", getItineraries);

itineraryRouter.get("/getItinerary/:id", getItineraryById);

itineraryRouter.get("/getUpcomingItineraries", getUpcomingItineraries);

itineraryRouter.get("/getTourGuideItinerary/:id", getTourGuideItinerary);

itineraryRouter.get("/searchItineraries", searchItineraries);

itineraryRouter.delete("/", deleteItineraries);

itineraryRouter.patch("/toggleFlag/:id", toggleFlaggedItineraries);

export default itineraryRouter;
