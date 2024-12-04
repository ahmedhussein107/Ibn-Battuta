import Order from "../models/order.model.js";
import Tourist from "../models/tourist.model.js";
import Product from "../models/product.model.js";
import TouristCart from "../models/touristCart.model.js";
import { sendNotificationToEmailAndSystem } from "./general.controller.js";

export const createOrder = async (req, res) => {
    try {
        const buyer = req.user.userId;
        const tourist = await Tourist.findById(buyer);
        let totalPrice = 0;
        let productsList = [];
        const cart = await TouristCart.find({ touristID: tourist._id }).populate(
            "productID"
        );
        console.log(1);
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
            console.log(product._id);
        }
        console.log(2);
        console.log(3);
        console.log(productsList);
        console.log({ buyer, purchases: productsList, totalPrice });
        const order = await Order.create({ buyer, purchases: productsList, totalPrice });
        console.log(4);
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
        const order = await Order.findById(req.params.id).populate("purchases.product");
        const { isWalletUsed, methodUsed, address } = req.body;
        const tourist = await Tourist.findById(order.buyer);
        if (isWalletUsed) {
            tourist.wallet = Math.max(0, tourist.wallet - booking.totalPrice);
            await tourist.save();
        }
        order.address = address;
        order.method = methodUsed;
        order.isComplete = true;
        await order.save();
        res.json(order);
        for (let purchase of order.purchases) {
            const product = purchase.productID;
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
        const order = await Order.findById(req.params.id);
        const tourist = await Tourist.findById(order.buyer);

        if (order.isComplete && order.status === "delivered") {
            return res.json({ message: "Can't delete a delivered order" });
        }
        for (let purchase of order.purchases) {
            const product = purchase.productID;
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
