import express from "express";
import {
    getTourists,
    getTouristById,
    createTourist,
    updateTourist,
    deleteTourist,
    redeemPoints,
} from "../controllers/tourist.controller.js";

const touristRouter = express.Router();

touristRouter.get("/getTourists", getTourists);

touristRouter.post("/createTourist", createTourist);

touristRouter.get("/tourist/:id", getTouristById);

touristRouter.patch("/updateTourist/:id", updateTourist);

touristRouter.delete("/deleteTourist/:id", deleteTourist);

touristRouter.patch("/redeemPoints/:id", redeemPoints);

export default touristRouter;
