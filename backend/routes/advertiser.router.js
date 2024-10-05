import express from "express";
import {
  createAdvertiser,
  getAllAdvertisers,
  getAdvertiserById,
  updateAdvertiser,
  deleteAdvertiser,
} from "../controllers/advertiser.controller.js";

const advertiserRouter = express.Router();

advertiserRouter.post("/createAdvertiser", createAdvertiser);

advertiserRouter.get("/allAdvertisers", getAllAdvertisers);

advertiserRouter.get("/advertiser/:id", getAdvertiserById);

advertiserRouter.patch("/updateAdvertiser/:id", updateAdvertiser);

advertiserRouter.delete("/deleteAdvertiser/:id", deleteAdvertiser);

export default advertiserRouter;
