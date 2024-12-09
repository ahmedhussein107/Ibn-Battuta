import express from "express";

import {
    createLandmarkTag,
    getLandmarkTags,
    updateLandmarkTag,
    deleteLandmarkTag,
    getLandmarkTag,
    searchLandmarkTags,
} from "../controllers/landmarkTag.controller.js";

const landmarkTagRouter = express.Router();

landmarkTagRouter.post("/createLandmarkTag", createLandmarkTag);

landmarkTagRouter.get("/allLandmarkTags", getLandmarkTags);

landmarkTagRouter.put("/updateLandmarkTag/:id", updateLandmarkTag);

landmarkTagRouter.delete("/deleteLandmarkTag/:id", deleteLandmarkTag);

landmarkTagRouter.get("/getLandmarkTag/:id", getLandmarkTag);

landmarkTagRouter.get("/searchLandmarkTag", searchLandmarkTags);

export default landmarkTagRouter;
