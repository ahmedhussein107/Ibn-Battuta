import express from "express";
import {
    createActivity,
    getAllActivities,
    updateActivity,
    deleteActivity,
    getActivityById,
    getAdvertiserActivities,
    getUpcomingActivities,
    toggleFlaggedActivities,
} from "../controllers/activity.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const activityRouter = express.Router();

activityRouter.post("/createActivity", isAuthenticated, createActivity);

activityRouter.get("/getActivity/:id", getActivityById);

activityRouter.get("/getAllActivities", getAllActivities);

activityRouter.patch("/updateActivity/:id", updateActivity);

activityRouter.get("/getAdvertiserActivities/", isAuthenticated, getAdvertiserActivities);

activityRouter.delete("/deleteActivity/:id", deleteActivity);

activityRouter.get("/getUpcomingActivities", getUpcomingActivities);

activityRouter.patch("/toggleFlag/:id", toggleFlaggedActivities);

export default activityRouter;
