import express from "express";
import Order from "../models/order.model.js";
import e from "express";
const orderRouter = express.Router();

orderRouter.post("/createOrder", async (req, res) => {
    try {
        const newOrder = await Order.create(req.body);
        res.json(newOrder);
        console.log({ message: "order created successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("not created");
    }
});

orderRouter.get("/getOrders", async (req, res) => {
    try {
        const orders = await Order.find().populate("buyer product");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

orderRouter.get("/getOrder/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: "order not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

orderRouter.delete("/deleteOrder/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (order) {
            res.json({ message: "order deleted successfully" });
        } else {
            res.status(404).json({ message: "order not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default orderRouter;
