import express from "express";
import Order from "../models/order.model.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";
const orderRouter = express.Router();

orderRouter.post("/createOrder", isAuthenticated, async (req, res) => {
	const buyer = req.user.userId;
	try {
		const newOrder = await Order.create({ ...req.body, buyer });
		res.json(newOrder);
		console.log({ message: "order created successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
		console.log("not created");
	}
});

orderRouter.get("/getOrders", isAuthenticated, async (req, res) => {
	try {
		const buyer = req.user.userId;
		const orders = await Order.find({ buyer }).populate("buyer product ratingID");
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

orderRouter.patch("/updateOrder/:id", async (req, res) => {
	try {
		const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
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
