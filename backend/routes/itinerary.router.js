import express from "express";
import Itinerary from "../models/itinerary.model.js";
import {getUpcomingItineraries} from "../controllers/itinerary.controller.js";

const itineraryRouter = express.Router();

itineraryRouter.get("/", getUpcomingItineraries);

itineraryRouter.post("/createItinerary", async (req, res) => {
  try {
    console.log(req.body);
    const itinerary = await Itinerary.create(req.body);
    res.status(200).json(itinerary);
  } catch (err) {
    res.status(400).json(err.message);
    console.log(err.message);
  }
});

itineraryRouter.get("/allItineraries", async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.status(200).json(itineraries);
  } catch (err) {
    res.status(400).json(err.message);
    console.log(err.message);
  }
});

itineraryRouter.patch("/updateItinerary/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!itinerary) {
      return res.status(404).send("Itinerary not found");
    }
    res.status(200).json(itinerary);
  } catch (err) {
    res.status(400).json(err.message);
    console.log(err.message);
  }
});

export default itineraryRouter;
