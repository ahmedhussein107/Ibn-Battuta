import express from "express";
import {
  getItineraries,
  filterItineraries,
  getItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  getUpcomingItineraries,
} from "../controllers/itinerary.controller.js";

const itineraryRouter = express.Router();

itineraryRouter.get("/upcoming", getUpcomingItineraries); // get all upcoming itineraries
itineraryRouter.post("/createItinerary", createItinerary);
itineraryRouter.patch("/updateItinerary/:id", updateItinerary);
itineraryRouter.delete("/deleteItinerary/:id", deleteItinerary);
itineraryRouter.get("/getAllItineraries", getItineraries);
itineraryRouter.get("/getItinerary/:id", getItineraryById);
itineraryRouter.get("/filterItineraries", filterItineraries);

export default itineraryRouter;
