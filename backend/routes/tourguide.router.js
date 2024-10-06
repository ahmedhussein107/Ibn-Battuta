import express from "express";
import {
    createTourGuide,
    getAllTourGuides,
    getTourGuideById,
    updateTourGuide,
    deleteTourGuide,
} from "../controllers/tourguide.controller.js";

const tourGuideRouter = express.Router();

tourGuideRouter.post("/createTourGuide", createTourGuide);

tourGuideRouter.get("/allTourGuides", getAllTourGuides);

tourGuideRouter.get("/tourGuide/:id", getTourGuideById);

tourGuideRouter.patch("/updateTourGuide/:id", updateTourGuide);

tourGuideRouter.delete("/deleteTourGuide/:id", deleteTourGuide);

export default tourGuideRouter;
