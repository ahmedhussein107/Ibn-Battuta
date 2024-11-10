import express from "express";
import {
	createRating,
	getRatingById,
	getRatings,
	deleteRating,
	updateRating,
	rateProduct,
	rateTourGuide,
	rateItinerary,
	rateActivity,
} from "../controllers/rating.controller.js";

import { isAuthenticated } from "../routers.middleware/authentication.js";

const ratingRouter = express.Router();

ratingRouter.post("/createRating", createRating);
ratingRouter.get("/getRating/:id", getRatingById);
ratingRouter.get("/getRatings", getRatings);
ratingRouter.patch("/updateRating/:id", updateRating);
ratingRouter.delete("/deleteRating/:id", deleteRating);
ratingRouter.post("/rateProduct/:id", isAuthenticated, rateProduct);
ratingRouter.post("/rateTourGuide/:id", isAuthenticated, rateTourGuide);
ratingRouter.post("/rateItinerary/:id", isAuthenticated, rateItinerary);
ratingRouter.post("/rateActivity/:id", isAuthenticated, rateActivity);

export default ratingRouter;
