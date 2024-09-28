import express from "express";
import Tourist from "../models/tourist.model.js";

const touristRouter = express.Router();

touristRouter.post("/createTourist", async (req, res) => {
  try {
    console.log(req.body);
    const tourist = await Tourist.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
});

export default touristRouter;
