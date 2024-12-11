import Seller from "../models/seller.model.js";
import Username from "../models/username.model.js";
import Email from "../models/email.model.js";
import Notification from "../models/notification.model.js";
import Product from "../models/product.model.js";
import Rating from "../models/rating.model.js";
import Order from "../models/order.model.js";
import bcrypt from "bcrypt";
import { assignCookies } from "./general.controller.js";
import Admin from "../models/admin.model.js";
export const createSeller = async (req, res) => {
    //console.log(req.body);
    const inputUsername = req.body.username;
    const inputEmail = req.body.email;
    const username = await Username.findById(inputUsername);
    const email = await Email.findById(inputEmail);
    try {
        if (!username && !email) {
            const newUsername = await Username.create({
                _id: inputUsername,
                userType: "Seller",
            });
            const newEmail = await Email.create({
                _id: inputEmail,
            });
            // hashing password 10 times
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;

            const newSeller = await Seller.create(req.body);
            res.status(201).json({ message: "Sign up successful", user: newSeller });
        } else {
            if (username) {
                res.status(400).json({ e: "Username already exists" });
            } else {
                res.status(400).json({ e: "Email already exists" });
            }
        }
    } catch (e) {
        await Username.findByIdAndDelete(inputUsername);
        await Email.findByIdAndDelete(inputEmail);
        res.status(400).json({ e: e.message });
    }
};

export const getSellers = async (req, res) => {
    try {
        const sellers = await Seller.find();
        res.status(200).json(sellers);
    } catch (e) {
        //console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};

export const getSellerById = async (req, res) => {
    const sellerId = req.user.userId;
    try {
        const seller = await Seller.findById(sellerId);
        if (seller) {
            res.status(200).json(seller);
        } else {
            res.status(404).json({ e: "Seller not found" });
        }
    } catch (e) {
        //console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};

export const updateSeller = async (req, res) => {
    let sellerId = req.user.userId;
    const admin = await Admin.findById(req.user.userId);
    if (admin) {
        sellerId = req.query.userId;
    }
    try {
        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: "seller not found" });
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        if (req.body.email) {
            try {
                await Email.findByIdAndDelete(seller.email);
                await Email.create({
                    _id: req.body.email,
                });
            } catch (e) {
                await Email.create({
                    _id: seller.email,
                });
                return res
                    .status(400)
                    .json({ message: "Error updating email", error: e.message });
            }
        }

        // Update seller details
        const updatedseller = await Seller.findByIdAndUpdate(sellerId, req.body, {
            new: true,
        });

        res.status(200).json(updatedseller);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteSeller = async (req, res) => {
    let sellerId = req.user.userId;
    const admin = await Admin.findById(req.user.userId);
    if (admin) {
        sellerId = req.query.userId;
    }
    try {
        const products = await Product.find({
            ownerID: sellerId,
            ownerType: "Seller",
        });
        const productIds = products.map((product) => product._id);
        const orders = await Order.find({
            products: { $in: productIds },
            status: "pending",
        });
        if (orders.length > 0) {
            return res
                .status(400)
                .json({ e: "Cannot delete seller with pending orders" });
        } else {
            const seller = await Seller.findByIdAndDelete(sellerId);
            if (seller) {
                await Username.findByIdAndDelete(seller.username);
                await Email.findByIdAndDelete(seller.email);

                // If there are notifications, delete each one
                if (seller.notifications && seller.notifications.length > 0) {
                    await Promise.all(
                        seller.notifications.map(async (notificationId) => {
                            await Notification.findByIdAndDelete(notificationId);
                        })
                    );
                }

                // Find all products associated with this seller
                const products = await Product.find({
                    ownerID: sellerId,
                    ownerType: "Seller",
                });

                // Iterate over the products and delete each product's ratings
                await Promise.all(
                    products.map(async (product) => {
                        if (product.ratings && product.ratings.length > 0) {
                            await Promise.all(
                                product.ratings.map(async (ratingId) => {
                                    await Rating.findByIdAndDelete(ratingId);
                                })
                            );
                        }
                    })
                );

                // Delete all products associated with this seller
                await Product.deleteMany({ ownerID: req.params.id, ownerType: "Seller" });
                res.status(200).json({ message: "Seller deleted successfully" });
            } else {
                res.status(404).json({ e: "Seller not found" });
            }
        }
    } catch (e) {
        //console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};

export const changeSellerPassword = async (req, res) => {
    const sellerId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    try {
        if (!oldPassword || !newPassword) {
            return res
                .status(400)
                .json({ message: "Both old and new passwords are required" });
        }
        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: "seller not found" });
        }
        const isMatch = await bcrypt.compare(oldPassword, seller.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }
        seller.password = await bcrypt.hash(newPassword, 10);
        await seller.save();
        return res.status(200).json({ message: "Password changed successfully!" });
    } catch (err) {
        console.error("Error changing password:", err);
        return res.status(400).json("An error occurred while changing the password");
    }
};

export const getSellersDocuments = async (req, res) => {
    try {
        const sellers = await Seller.find();
        const sellersDocuments = sellers.map((seller) => {
            return {
                username: seller.username,
                documents: seller.documents,
            };
        });
        res.status(200).json(sellersDocuments);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};
