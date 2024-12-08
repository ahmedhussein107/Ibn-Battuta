import express from "express";

import {
	createLandmarkTag,
	getLandmarkTags,
	updateLandmarkTag,
	deleteLandmarkTag,
	getLandmarkTag,
} from "../controllers/landmarkTag.controller.js";

const tagRouter = express.Router();

tagRouter.post("/createLandmarkTag", createLandmarkTag);

tagRouter.get("/allLandmarkTags", getLandmarkTags);

tagRouter.put("/updateLandmarkTag/:id", updateLandmarkTag);

tagRouter.delete("/deleteLandmarkTag/:id", deleteLandmarkTag);

tagRouter.get("/getLandmarkTag/:id", getLandmarkTag);

export default tagRouter;
