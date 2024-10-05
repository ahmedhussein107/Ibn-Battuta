  import express from "express";
import Rating from "../models/rating.model.js";

const ratingRouter = express.Router();

ratingRouter.get("/allRatings", async (req, res) => {
  try {
    const allRatings = await Rating.find();
    res.json(allRatings);
  } catch (error) {
    res.json({ message: error.message });
  }
});

ratingRouter.get("/getRating/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const rating = await Rating.findById(id);
    if (!rating) return res.status(404).json({ message: "Rating not found" });
    res.json(rating);
  } catch (error) {
    res.json({ message: error.message });
  }
});

ratingRouter.post("/createRating", async (req, res) => {
  try {
    const newRating = new Rating(req.body);
    await newRating.save();
    res.json(newRating);
  } catch (error) {
    res.json({ message: error.message });
  }
});

ratingRouter.patch("updateRating", async (req, res) => {
  try {
    const rating = await Rating.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!rating) return res.status(404).json({ message: "Rating not found" });
    res.json(rating);
  } catch (error) {
    res.json({ message: error.message });
  }
});

ratingRouter.delete("/deleteRating/:id", async (req, res) => {
  try {
    const rating = await Rating.findByIdAndDelete(req.params.id);
    if (!rating) return res.status(404).json({ message: "Rating not found" });
    res.json({ message: "Rating deleted successfully" });
  } catch (error) {
    res.json({ message: error.message });
  }
});

export default ratingRouter;
