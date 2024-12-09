import express from "express";
import {
    createLandmark,
    getLandmarkById,
    getTicketPricesFromLandmark,
    getAllLandmarks,
    updateLandmark,
    deleteLandmark,
    getGovernorLandmarks,
} from "../controllers/landmark.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const landmarkRouter = express.Router();

landmarkRouter.post("/createLandmark", createLandmark);

landmarkRouter.get("/allLandmarks", getAllLandmarks);

landmarkRouter.get("/landmark/:id", getLandmarkById);

landmarkRouter.get("/ticketPricesFromLandmark/:id", getTicketPricesFromLandmark);

landmarkRouter.patch("/updateLandmark/:id", updateLandmark);

landmarkRouter.delete("/deleteLandmark/:id", deleteLandmark);

landmarkRouter.get("/getGovernorLandmarks", isAuthenticated, getGovernorLandmarks);

export default landmarkRouter;
