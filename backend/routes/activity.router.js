import express from "express";
import {
    createActivity,
    getActivity,
    updateActivity,
    deleteActivity,
    getActivityById,
    getAdvertiserActivities,
    getUpcomingActivities,
    toggleFlaggedActivities,
} from "../controllers/activity.controller.js";

const activityRouter = express.Router();

activityRouter.post("/createActivity", createActivity);

activityRouter.get("/getActivity/:id", getActivityById);

activityRouter.get("/getAllActivties", getActivity);

activityRouter.patch("/updateActivity/:id", updateActivity);

activityRouter.get("/getAdvertiserActivities/:id", getAdvertiserActivities);

activityRouter.delete("/deleteActivity/:id", deleteActivity);

activityRouter.get("/getUpcomingActivities", getUpcomingActivities);

activityRouter.patch("/toggleFlag/:id", toggleFlaggedActivities);

export default activityRouter;
