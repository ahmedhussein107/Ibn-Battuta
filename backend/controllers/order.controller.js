import Order from "../models/order.model.js";
import Tourist from "../models/tourist.model.js";
import Product from "../models/product.model.js";
import TouristCart from "../models/touristCart.model.js";
import { sendNotificationToEmailAndSystem } from "./general.controller.js";

export const createOrder = async (req, res) => {
    try {
        const buyer = req.user.userId;
        const tourist = await Tourist.findById(buyer);
        const { method, address } = req.body;
        let totalPrice = 0;
        let productsList = [];
        const cart = await TouristCart.find({ touristID: tourist._id }).populate(
            "productID"
        );
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

export const completeOrder = async (req, res) => {
    try {
        console.log("gowa completee order");
        const order = await Order.findById(req.params.id).populate("purchases.product");
        const { isWalletUsed } = req.body;
        const tourist = await Tourist.findById(order.buyer);
        if (isWalletUsed) {
            tourist.wallet = Math.max(0, tourist.wallet - booking.totalPrice);
            await tourist.save();
        }
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
        console.log("betro7 failure lehhhhhh");
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
            tourist.wallet += order.totalPrice;
            await tourist.save();
            order.status = "canceled";
            await order.save();
            return res.status(200).json({ message: "Order canceled successfully" });
        }
        const deletedOrder = await Order.findByIdAndDelete(order._id);
        return res
            .status(200)
            .json({ message: "Order deleted successfully", deletedOrder });
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
