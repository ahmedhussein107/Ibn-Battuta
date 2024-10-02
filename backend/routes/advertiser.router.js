import express from "express";
import Advertiser from "../models/advertiser.model.js";
const advertiserRouter = express.Router();

advertiserRouter.get("/getAdvertisers", async (req, res) => {
  try {
    const advertisers = await Advertiser.find();
    res.json(advertisers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

advertiserRouter.post("/createAdvertiser", async (req, res) => {
  const advertiser = req.body;
  const newAdvertiser = new Advertiser(advertiser);
  try {
    await newAdvertiser.save();
    res.status(201).json(newAdvertiser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

advertiserRouter.get("/getAdvertiser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const advertiser = await Advertiser.findById(id);
    if (advertiser) {
      res.json(advertiser);
    } else {
      res.status(404).json({ message: "Advertiser not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default advertiserRouter;
