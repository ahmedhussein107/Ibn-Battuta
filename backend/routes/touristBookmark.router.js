import express from "express";
import {
    toggleBookmark,
    getBookmarkStatus,
    getActivityBookmarks,
    getItineraryBookmarks,
} from "../controllers/touristBookmark.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const touristBookmarkRouter = express.Router();

touristBookmarkRouter.post("/bookmark", isAuthenticated, toggleBookmark);

touristBookmarkRouter.post("/getBookmarkStatus", isAuthenticated, getBookmarkStatus);

touristBookmarkRouter.get("/getActivityBookmarks", isAuthenticated, getActivityBookmarks);

touristBookmarkRouter.get(
    "/getItineraryBookmarks",
    isAuthenticated,
    getItineraryBookmarks
);

export default touristBookmarkRouter;
