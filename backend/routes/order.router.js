import express from "express";
// import Order from "../models/order.model.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";
import {
    createOrder,
    getOrders,
    getOrdersByUser,
    updateOrder,
} from "../controllers/order.controller.js";
const orderRouter = express.Router();

orderRouter.post("/createOrder", isAuthenticated, createOrder);

orderRouter.get("/getOrders", isAuthenticated, getOrders);

orderRouter.patch("/updateOrder/:id", updateOrder);

orderRouter.get("/getMyOrders", isAuthenticated, getOrdersByUser);

export default orderRouter;
