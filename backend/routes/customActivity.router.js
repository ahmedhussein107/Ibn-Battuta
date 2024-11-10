import express from "express";
import {
    createCustomActivity,
    getCustomActivities,
    getCustomActivityById,
    updateCustomActivity,
    deleteCustomActivity,
    getCustomActivityByTourGuideId,
} from "../controllers/customActivity.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const customActivityRouter = express.Router();

customActivityRouter.post("/createCustomActivity", isAuthenticated, createCustomActivity);
customActivityRouter.get("/getAllCustomActivities", getCustomActivities);
customActivityRouter.get("/getCustomActivity/:id", getCustomActivityById);
customActivityRouter.patch("/updateCustomActivity/:id", updateCustomActivity);
customActivityRouter.delete("/deleteCustomActivity/:id", deleteCustomActivity);
customActivityRouter.get(
    "/getCustomActivityByTourGuideId",
    isAuthenticated,
    getCustomActivityByTourGuideId
);

export default customActivityRouter;
