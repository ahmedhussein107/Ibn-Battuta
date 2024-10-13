import express from "express";
import {
	createRating,
	getRatingById,
	getRatings,
	deleteRating,
	updateRating,
	rateProduct,
	rateTourGuide,
	rateItinerary
} from "../controllers/rating.controller.js";

const ratingRouter = express.Router();

ratingRouter.post("/createRating", createRating);
ratingRouter.get("/getRating/:id", getRatingById);
ratingRouter.get("/getRatings", getRatings);
ratingRouter.patch("/updateRating/:id", updateRating);
ratingRouter.delete("/deleteRating/:id", deleteRating);
ratingRouter.post("/rateProduct/:id", rateProduct);
ratingRouter.post("/rateTourGuide/:id", rateTourGuide);
ratingRouter.post("/rateItinerary/:id", rateItinerary);

export default ratingRouter;
