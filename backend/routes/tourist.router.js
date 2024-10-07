import express from "express";
import {
    getTourists,
    getTouristById,
    createTourist,
    updateTourist,
    deleteTourist,
} from "../controllers/tourist.controller.js";

const touristRouter = express.Router();

touristRouter.get("/allTourists", getTourists);

touristRouter.post("/createTourist", createTourist);

touristRouter.get("/tourist/:id", getTouristById);

touristRouter.patch("/updateTourist/:id", updateTourist);

touristRouter.delete("/deleteTourist/:id", deleteTourist);

export default touristRouter;
