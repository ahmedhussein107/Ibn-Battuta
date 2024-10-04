import express from "express";
import {
  getItineraries,
  filterItineraries,
  getItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
} from "../controllers/itinerary.controller.js";

const itineraryRouter = express.Router();

itineraryRouter.post("/createItinerary", createItinerary);
itineraryRouter.patch("/updateItinerary/:id", updateItinerary);
itineraryRouter.delete("/deleteItinerary/:id", deleteItinerary);
itineraryRouter.get("/getAllItineraries", getItineraries);
itineraryRouter.get("/getItinerary/:id", getItineraryById);
itineraryRouter.get("/filterItineraries", filterItineraries);

export default itineraryRouter;
