import express from "express";
import activity from "../models/activity.model.js";

const activityRouter = express.Router();

activityRouter.get("/", async (req, res) => {
  try {
    const activities = await activity.find();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

activityRouter.post("/", async (req, res) => {
  const activityData = req.body;
  const newActivity = new activity(activityData);
  try {
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default activityRouter;
