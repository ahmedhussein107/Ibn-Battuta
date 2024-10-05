import express from "express";
import {
  createRating,
  getRatingById,
  getRatings,
  deleteRating,
  updateRating,
} from "../controllers/rating.controller.js";

const ratingRouter = express.Router();

ratingRouter.post("/createRating", createRating);
ratingRouter.get("/getRating/:id", getRatingById);
ratingRouter.get("/getRatings", getRatings);
ratingRouter.patch("/updateRating/:id", updateRating);
ratingRouter.delete("/deleteRating/:id", deleteRating);

export default ratingRouter;
