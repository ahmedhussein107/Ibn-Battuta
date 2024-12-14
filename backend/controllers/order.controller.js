import Order from "../models/order.model.js";
import Tourist from "../models/tourist.model.js";
import Product from "../models/product.model.js";
import TouristCart from "../models/touristCart.model.js";
import cron from "node-cron";
import { sendNotificationToEmailAndSystem } from "./general.controller.js";
import sendEmail from "../utilities/emailUtils.js";

export const createOrder = async (req, res) => {
	try {
		const buyer = req.user.userId;
		const tourist = await Tourist.findById(buyer);
		const { method, address } = req.body;
		let totalPrice = 0;
		let productsList = [];
		const cart = await TouristCart.find({ touristID: tourist._id }).populate("productID");
		for (let entry of cart) {
			const product = entry.productID;
			const count = entry.count;
			const price = product.price * count;
			totalPrice += price;
			if (product.quantity < count) {
				return res.status(400).json({ message: "Not enough quantity" });
			}
			product.quantity -= count;
			product.numberOfSales += count;
			productsList.push({ product: product._id, count, price });
		}
		const order = await Order.create({
			buyer,
			purchases: productsList,
			totalPrice,
			method,
			address,
		});
		for (let entry of cart) {
			const product = entry.productID;
			await product.save();
		}
		res.status(201).json({ message: "Order created successfully", order });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const getOrderByID = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate(
			"purchases.product purchases.ratingID"
		);
		res.status(200).json(order);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const completeOrder = async (req, res) => {
	try {
		console.log("gowa completee order");
		const order = await Order.findById(req.params.id).populate("purchases.product");
		const { amountFromWallet } = req.body;
		const tourist = await Tourist.findById(order.buyer);
		tourist.wallet -= amountFromWallet;
		await tourist.save();
		order.amountFromWallet = amountFromWallet;
		order.isComplete = true;
		await order.save();

		for (let purchase of order.purchases) {
			const product = purchase.product;
			if (product.quantity == 0) {
				sendNotificationToEmailAndSystem(
					"Product out of stock",
					`Your Product ${product.name} is becoming popular on our shop!\n Now it is out of stock, you can restock it by visiting your product page on our website`,
					product.ownerID,
					product.ownerType,
					product._id,
					"Product"
				);
			}
		}
		const cart = await TouristCart.deleteMany({ touristID: tourist._id });
		res.status(200).json({ message: "Order completed successfully", order });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const getOrders = async (req, res) => {
	try {
		const orders = await Order.find().populate("buyer product");
		res.json(orders);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deleteOrder = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate("purchases.product");
		const tourist = await Tourist.findById(order.buyer);

		if (order.isComplete && order.status === "delivered") {
			return res.json({ message: "Can't delete a delivered order" });
		}

		for (let purchase of order.purchases) {
			const product = purchase.product;
			product.quantity += purchase.count;
			product.numberOfSales -= purchase.count;
			await product.save();
		}

		if (order.isComplete) {
			// I want also to add amount to the wallet of the tourist
			if (order.method === "cash on delivery") {
				tourist.wallet += order.amountFromWallet;
			} else {
				tourist.wallet += order.totalPrice;
			}
			await tourist.save();
			order.status = "canceled";
			await order.save();
			return res.status(200).json({ message: "Order canceled successfully" });
		}
		const deletedOrder = await Order.findByIdAndDelete(order._id);
		return res.status(200).json({ message: "Order deleted successfully", deletedOrder });
	} catch (err) {
		return res.status(400).json({ message: err.message });
	}
};

export const updateOrder = async (req, res) => {
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
};

export const addRatingToProduct = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (!order) {
			return res.status(400).json({ message: "Order not found" });
		}
		console.log(order);

		const { productID, ratingID } = req.body;
		for (let purchase of order.purchases) {
			if (purchase.product._id == productID) {
				purchase.ratingID = ratingID;
				await order.save();
				return res.status(200).json({ message: "rating added successfully", order });
			}
		}
		return res.status(400).json({ message: "Product not found in order" });
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

export const getOrdersByUser = async (req, res) => {
	try {
		const page = Math.max(1, parseInt(req.query.page) || 1);
		const limit = Math.max(1, parseInt(req.query.limit) || 10);
		const toSkip = (page - 1) * limit;
		const filter = req.query.filter;

		let orders = await Order.find({ buyer: req.user.userId }).populate(
			"purchases.product purchases.ratingID"
		);
		if (filter !== "All") {
			orders = orders.filter((order) => order.status === filter.toLowerCase());
		}
		const total = orders.length;
		orders = total > 0 ? orders.slice(toSkip, toSkip + limit) : [];
		console.log(orders);
		res.status(200).json({
			result: orders,
			totalPages: total > 0 ? Math.ceil(total / limit) : 1,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Set up scheduled jobs
export const setupOrderDeliveryScheduledJobs = () => {
	cron.schedule("*/2 * * * *", async () => {
		await deliverOrders();
	});
};

// Deliver orders
export const deliverOrders = async () => {
	try {
		const orders = await Order.find({ status: "pending" }).populate("purchases.product");
		for (let order of orders) {
			order.status = "delivered";
			try {
				await order.save();
				console.log(`Order ${order._id} delivered`);
				sendOrderDeliveredEmail(order);
			} catch (err) {
				console.log(err);
			}
		}
	} catch (error) {
		console.log("Error delivering orders:", error);
	}
};

// Send order delivered email
const sendOrderDeliveredEmail = async (order) => {
	try {
		const tourist = await Tourist.findById(order.buyer);
		const products = order.purchases.map((purchase) => purchase.product.name).join(", ");
		console.log(`Sending order delivered email to ${tourist.email}`);
		// sendNotificationToEmailAndSystem(
		// 	"Order Delivered",
		// 	`Your order (${products}) has been delivered successfully!`,
		// 	tourist._id,
		// 	"Tourist",
		// 	order._id,
		// 	"Order"
		// );
		sendEmail(
			tourist.email,
			"Order Delivered",
			`Your order (${products}) has been delivered successfully!`
		);
	} catch (error) {
		console.log("Error sending order delivered email:", error);
	}
};
