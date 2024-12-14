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
    getUserName,
} from "../controllers/tourguide.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const tourGuideRouter = express.Router();

tourGuideRouter.post("/createTourGuide", createTourGuide);

tourGuideRouter.get("/getTourGuides", getTourGuides);

tourGuideRouter.get("/tourGuide/:username", getTourGuideById);

tourGuideRouter.get("/tourGuideLoggedIn/:username", isAuthenticated, getTourGuideById);

tourGuideRouter.get("/getTourGuideUsername", isAuthenticated, getUserName);

tourGuideRouter.put("/updateTourGuide", isAuthenticated, updateTourGuide);

tourGuideRouter.delete("/deleteTourGuide", isAuthenticated, deleteTourGuide);

tourGuideRouter.put("/changeTourguidePassword", isAuthenticated, changeTourguidePassword);

tourGuideRouter.get("/documents", getTourGuidesDocuments);

tourGuideRouter.get("/tourGuide/:id", getTourGuide);

export default tourGuideRouter;
