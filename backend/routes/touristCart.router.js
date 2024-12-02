import express from "express";

import {
    getTouristCart,
    updateTouristCart,
    deleteTouristCart,
    deleteItemFromTouristCart,
} from "../controllers/touristCart.controller.js";

import { isAuthenticated } from "../routers.middleware/authentication.js";

const touristCartRouter = express.Router();

touristCartRouter.get("/getCart", isAuthenticated, getTouristCart);

touristCartRouter.post("/updateCart", isAuthenticated, updateTouristCart);

touristCartRouter.delete("/clearCart", isAuthenticated, deleteTouristCart);

touristCartRouter.delete("/deleteProduct", isAuthenticated, deleteItemFromTouristCart);

export default touristCartRouter;
