import express from "express";
// import Order from "../models/order.model.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";
import {
    createOrder,
    getOrders,
    getOrdersByUser,
    updateOrder,
    completeOrder,
    deleteOrder,
    getOrderByID,
    addRatingToProduct,
} from "../controllers/order.controller.js";
const orderRouter = express.Router();

orderRouter.post("/createOrder", isAuthenticated, createOrder);

orderRouter.get("/getOrders", isAuthenticated, getOrders);

orderRouter.get("/getOrder/:id", getOrderByID);

orderRouter.patch("/updateOrder/:id", updateOrder);

orderRouter.patch("/completeOrder/:id", completeOrder);

orderRouter.delete("/deleteOrder/:id", deleteOrder);

orderRouter.get("/getMyOrders", isAuthenticated, getOrdersByUser);

orderRouter.patch("/addRating/:id", addRatingToProduct);

export default orderRouter;
