import express from "express";
import {
    getTourist,
    createTourist,
    updateTourist,
    deleteTourist,
} from "../controllers/tourist.controller.js";

const touristRouter = express.Router();

touristRouter.get("/allTourists", getTourist);

touristRouter.post("/createTourist", createTourist);

touristRouter.patch("/updateTourist/:id", updateTourist);

touristRouter.delete("/deleteTourist/:id", deleteTourist);

export default touristRouter;
