import express from "express";
import {
    createTourGuide,
    getTourGuides,
    getTourGuideById,
    updateTourGuide,
    deleteTourGuide,
} from "../controllers/tourguide.controller.js";

const tourGuideRouter = express.Router();

tourGuideRouter.post("/createTourGuide", createTourGuide);

tourGuideRouter.get("/getTourGuides", getTourGuides);

tourGuideRouter.get("/tourGuide/:id", getTourGuideById);

tourGuideRouter.patch("/updateTourGuide/:id", updateTourGuide);

tourGuideRouter.delete("/deleteTourGuide/:id", deleteTourGuide);

export default tourGuideRouter;
