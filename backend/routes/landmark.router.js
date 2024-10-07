import express from "express";
import {
  createLandmark,
  getLandmarkById,
  getTicketPricesFromLandmark,
  getAllLandmarks,
  updateLandmark,
  deleteLandmark,
  getGovernorLandmarks,
  searchLandmarks,
  filterLandmarks,
} from "../controllers/landmark.controller.js";

const landmarkRouter = express.Router();

landmarkRouter.post("/createLandmark", createLandmark);

landmarkRouter.get("/allLandmark", getAllLandmarks);

landmarkRouter.get("/landmark/:id", getLandmarkById);

landmarkRouter.get(
  "/ticketPricesFromLandmark/:id",
  getTicketPricesFromLandmark
);

landmarkRouter.patch("/updateLandmark/:id", updateLandmark);

landmarkRouter.delete("/deleteLandmark/:id", deleteLandmark);

landmarkRouter.get("/getGovernorLandmarks/:id", getGovernorLandmarks);

landmarkRouter.get("/searchLandmarks", searchLandmarks);

landmarkRouter.get("/filterLandmarks", filterLandmarks);

export default landmarkRouter;
