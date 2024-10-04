import express from "express";
import TourGuide from "../models/tourguide.model.js";

const tourGuideRouter = express.Router();

tourGuideRouter.post("/createTourGuide", async (req, res) => {
  try {
    console.log(req.body);
    const tourGuide = await TourGuide.create(req.body);
    res.json(tourGuide);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
});

tourGuideRouter.get("/allTourGuides", async (req, res) => {
  try {
    const tourguides = await TourGuide.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
});

tourGuideRouter.patch("/updateTourGuide/:id", async (req, res) => {
  try {
    const tourGuide = await TourGuide.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(tourGuide);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
});

tourGuideRouter.delete("/deleteTourGuide/:id", async (req, res) => {
  try {
    const tourGuide = await TourGuide.findByIdAndDelete(req.params.id);
    res.json(tourGuide);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
});

export default tourGuideRouter;
