import express from "express";
// import Order from "../models/order.model.js";
// import { isAuthenticated } from "../routers.middleware/authentication.js";
import { createOrder } from "../controllers/order.controller.js";
const orderRouter = express.Router();

orderRouter.post("/createOrder", createOrder);

export default orderRouter;
