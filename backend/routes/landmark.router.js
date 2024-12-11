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

landmarkRouter.get("/landmark/:id", isAuthenticated, getLandmarkById);

landmarkRouter.get(
    "/ticketPricesFromLandmark",
    isAuthenticated,
    getTicketPricesFromLandmark
);

landmarkRouter.patch("/updateLandmark/:id", isAuthenticated, updateLandmark);

landmarkRouter.delete("/deleteLandmark/:id", isAuthenticated, deleteLandmark);

landmarkRouter.get(
    "/getGovernorLandmarks",
    isAuthenticated,
    getGovernorLandmarks
);

export default landmarkRouter;
