import orderModel from "../models/order.model.js";
// import { isAuthenticated } from "../routers.middleware/authentication";
import Tourist from "../models/tourist.model.js";
import Product from "../models/product.model.js";
export const createOrder = async (req, res) => {
    try {
        const { buyer, product, quantity } = req.body;
        const tourist = await Tourist.findById(buyer);
        const pro = await Product.findById(req.body.product);
        if (pro.quantity < quantity) {
            return res.status(400).json({ message: "Not enough quantity" });
        }
        if (tourist.wallet < pro.price * quantity) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        tourist.wallet -= product.price * quantity;
        await tourist.save();
        pro.quantity -= quantity;
        pro.numberOfSales += quantity;
        await pro.save();
        const order = await orderModel.create(req.body);
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().populate("buyer product");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const order = await orderModel.findByIdAndDelete(req.params.id);
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
        const order = await orderModel.findByIdAndUpdate(req.params.id, req.body, {
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
        const orders = await orderModel
            .find({ buyer: req.user.userId })
            .populate("product");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
