import express from "express";
import {
    getTourists,
    getTouristById,
    createTourist,
    updateTourist,
    deleteTourist,
} from "../controllers/tourist.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const touristRouter = express.Router();

touristRouter.get("/getTourists", getTourists);

touristRouter.post("/createTourist", createTourist);

touristRouter.get("/tourist",isAuthenticated, getTouristById);

touristRouter.patch("/updateTourist/:id", updateTourist);

touristRouter.delete("/deleteTourist/:id", deleteTourist);

export default touristRouter;
