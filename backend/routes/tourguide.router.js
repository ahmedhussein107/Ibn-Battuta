import express from "express";
import {
    createTourGuide,
    getTourGuides,
    getTourGuideById,
    updateTourGuide,
    deleteTourGuide,
    getTourGuidesDocuments,
} from "../controllers/tourguide.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const tourGuideRouter = express.Router();

tourGuideRouter.post("/createTourGuide", createTourGuide);

tourGuideRouter.get("/getTourGuides", getTourGuides);

tourGuideRouter.get("/getTourGuideById", isAuthenticated, getTourGuideById);

tourGuideRouter.patch("/updateTourGuide/:id", updateTourGuide);

tourGuideRouter.delete("/deleteTourGuide/:id", deleteTourGuide);

tourGuideRouter.get("/documents", getTourGuidesDocuments);

export default tourGuideRouter;
