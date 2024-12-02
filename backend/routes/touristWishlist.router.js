import express from "express";
import {
    toggleWishlist,
    getProductsStatus,
    getWishlistProducts,
} from "../controllers/touristWishlist.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";

const touristWishlistRouter = express.Router();

touristWishlistRouter.post("/wishlist", isAuthenticated, toggleWishlist);

touristWishlistRouter.post("/getProductsStatus", isAuthenticated, getProductsStatus);

touristWishlistRouter.get("/getWishlistProducts", isAuthenticated, getWishlistProducts);

export default touristWishlistRouter;
