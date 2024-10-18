import express from "express";
import mongoose from "mongoose";
import Seller from "../models/seller.model.js";
import Advertiser from "../models/advertiser.model.js";
import TourGuide from "../models/tourguide.model.js";

const generalRouter = express.Router();

const setAcceptedTerms = async (req, res) => {
  try {
    const { userType, userId } = req.body;
    if (!userType || !userId) {
      return res.status(400).json({ message: "Invalid user type or ID" });
    }
    const UserModel = mongoose.model(userType);
    if (!UserModel) {
      return res.status(400).json({ message: "Invalid user type" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.acceptedTerms = true;
    await user.save();
    res.status(200).json({ message: "User accepted successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

generalRouter.post("/setAcceptedTerms", setAcceptedTerms);

export default generalRouter;
