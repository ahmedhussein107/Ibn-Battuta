import express from "express";
import Activity from "../models/activity.model.js";
import { getActivities } from "../controllers/activity.controller.js";

const activityRouter = express.Router();

activityRouter.get("/", getActivities);

activityRouter.post("/", async (req, res) => {
  const activityData = req.body;
  const newActivity = new Activity(activityData);
  try {
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default activityRouter;
