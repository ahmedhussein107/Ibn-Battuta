import express from "express"
import Landmark from "../models/landmark.model.js";
import { getLandmarks } from "../controllers/landmark.controller.js";

const landmarkRouter = express.Router();

landmarkRouter.post("/createLandmark", async (req, res) => {
    try {
      console.log(req.body);
      const landmark = await Landmark.create(req.body);
      res.json(landmark);
    } catch (e) {
        res.status(400).json({e: e.message});
    }
});


landmarkRouter.get("/", getLandmarks); //get all landmarks

landmarkRouter.get("/ticketPricesFromLandmark", async (req, res) => {
    try {
        const landmark = await Landmark.find({},"ticketPrices");
        res.json(landmark);
    } catch (e) {
        res.status(400).json({e: e.message});
    }
    });

landmarkRouter.put("/updateLandmark", async (req, res) => {
    const {landmark} = req.body
    try {
        const landmark = await Landmark.updateOne({}, {landmark});
        res.json(landmark);
    } catch (e) {
        res.status(400).json({e: e.message});
    }
    });


    landmarkRouter.delete("/deleteLandmark", async (req, res) => {
        try {
            const landmark = await Landmark.deleteOne({});
            res.json(landmark);
        } catch (e) {
            res.status(400).json({e: e.message});
        }
        });

export default landmarkRouter;
