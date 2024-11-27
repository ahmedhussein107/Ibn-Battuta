import express from "express";
import {
    getTourists,
    getTouristById,
    createTourist,
    updateTourist,
    deleteTourist,
    redeemPoints,
    addPreference,
    removePreference,
    changeTouristPassword,
    addBookmark,
    isBookmarked,
} from "../controllers/tourist.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const touristRouter = express.Router();

touristRouter.get("/getTourists", getTourists);

touristRouter.post("/createTourist", createTourist);

touristRouter.get("/tourist", isAuthenticated, getTouristById);

touristRouter.put("/updateTourist", isAuthenticated, updateTourist);

touristRouter.delete("/deleteTourist", isAuthenticated, deleteTourist);

touristRouter.post("/redeemPoints", isAuthenticated, redeemPoints);

touristRouter.post("/addPreference", isAuthenticated, addPreference);

touristRouter.delete("/removePreference", isAuthenticated, removePreference);

touristRouter.patch("/updatePassword", isAuthenticated, changeTouristPassword);

touristRouter.post("/bookmark", isAuthenticated, addBookmark);

touristRouter.get("/isBookmarked/:id", isAuthenticated, isBookmarked);

export default touristRouter;
