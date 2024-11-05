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

const landmarkRouter = express.Router();

landmarkRouter.post("/createLandmark", createLandmark);

landmarkRouter.get("/allLandmarks", getAllLandmarks);

landmarkRouter.get("/landmark/:id", getLandmarkById);

landmarkRouter.get("/ticketPricesFromLandmark/:id", getTicketPricesFromLandmark);

landmarkRouter.patch("/updateLandmark/:id", updateLandmark);

landmarkRouter.delete("/deleteLandmark/:id", deleteLandmark);

landmarkRouter.get("/getGovernorLandmarks/:id", getGovernorLandmarks);

export default landmarkRouter;
