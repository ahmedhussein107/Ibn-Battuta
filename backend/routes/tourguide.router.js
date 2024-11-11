import express from "express";
import {
    createTourGuide,
    getTourGuides,
    getTourGuideById,
    updateTourGuide,
    deleteTourGuide,
    getTourGuidesDocuments,
    changeTourguidePassword,
    getTourGuide,
} from "../controllers/tourguide.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";
import { get } from "http";

const tourGuideRouter = express.Router();

tourGuideRouter.post("/createTourGuide", createTourGuide);

tourGuideRouter.get("/getTourGuides", getTourGuides);

tourGuideRouter.get("/tourGuide", isAuthenticated, getTourGuideById);

tourGuideRouter.put("/updateTourGuide", isAuthenticated, updateTourGuide);

tourGuideRouter.delete("/deleteTourGuide", isAuthenticated, deleteTourGuide);

tourGuideRouter.put("/changeTourguidePassword", isAuthenticated, changeTourguidePassword);

tourGuideRouter.get("/documents", getTourGuidesDocuments);

tourGuideRouter.get("/tourGuide/:id", getTourGuide);

export default tourGuideRouter;
