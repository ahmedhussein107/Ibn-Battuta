import Order from "../models/order.model.js";
import Tourist from "../models/tourist.model.js";
import Product from "../models/product.model.js";
import { sendNotificationToEmailAndSystem } from "./general.controller.js";
export const createOrder = async (req, res) => {
    try {
        req.body.buyer = req.user.userId;
        const { product, count, price, buyer } = req.body;
        const tourist = await Tourist.findById(buyer);
        const pro = await Product.findById(product);
        if (pro.quantity < count) {
            return res.status(400).json({ message: "Not enough quantity" });
        }
        if (tourist.wallet < price) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        tourist.wallet -= price;
        await tourist.save();
        pro.quantity -= count;
        pro.numberOfSales += count;
        if (pro.quantity == 0) {
            sendNotificationToEmailAndSystem(
                "Product out of stock",
                `Your Product ${pro.name} is becoming popular on our shop!\n Now it is out of stock, you can restock it by visiting your product page on our website`,
                pro.ownerID,
                pro.ownerType,
                pro._id,
                "Product"
            );
        }
        await pro.save();
        const order = await Order.create(req.body);
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
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
        const order = await Order.findByIdAndDelete(req.params.id);
        if (order) {
            res.json({ message: "order deleted successfully" });
        } else {
            res.status(404).json({ message: "order not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
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

export const getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.userId }).populate(
            "product ratingID"
        );
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
