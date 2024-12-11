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

landmarkRouter.post("/createLandmark", isAuthenticated, createLandmark);

landmarkRouter.get("/allLandmarks", getAllLandmarks);

landmarkRouter.get("/landmark", isAuthenticated, getLandmarkById);

landmarkRouter.get(
    "/ticketPricesFromLandmark",
    isAuthenticated,
    getTicketPricesFromLandmark
);

landmarkRouter.patch("/updateLandmark", isAuthenticated, updateLandmark);

landmarkRouter.delete("/deleteLandmark", isAuthenticated, deleteLandmark);

landmarkRouter.get(
    "/getGovernorLandmarks",
    isAuthenticated,
    getGovernorLandmarks
);

export default landmarkRouter;
