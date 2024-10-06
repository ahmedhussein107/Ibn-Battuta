import express from "express";
import {
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
  getActivityById,
  searchActivities,
  getUpcomingActivities
} from "../controllers/activity.controller.js";

const activityRouter = express.Router();

activityRouter.post("/createActivity", createActivity);

activityRouter.get("/getActivity/:id", getActivityById);

activityRouter.get("/getAllActivties", getActivity);

activityRouter.patch("/updateActivity/:id", updateActivity);

activityRouter.delete("/deleteActivity/:id", deleteActivity);

activityRouter.get("/searchActivities", searchActivities);

activityRouter.get("/upcoming", getUpcomingActivities);


export default activityRouter;
