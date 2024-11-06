import mongoose from "mongoose";
import Seller from "../models/seller.model.js";
import Advertiser from "../models/advertiser.model.js";
import TourGuide from "../models/tourguide.model.js";
import Tourist from "../models/tourist.model.js";
import admin from "../models/admin.model.js";
import Governor from "../models/governor.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey =
    process.env.JWT_SECRET || "any key to cipher the password and decipher ";

export const updatePassword = async (req, res) => {
    try {
        const { userType, userId, oldPassword, newPassword } = req.body;

        const UserModel = mongoose.model(userType);
        if (!UserModel) {
            return res.status(400).json({ message: "Invalid user type" });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const assignCookies = async (res, userType, userId) => {
    const token = jwt.sign({ userId, userType }, secretKey, {
        expiresIn: "5h",
    });

    res.cookie("jwt", token, {
        //httpOnly: true,
        maxAge: 3600000,
    });
    res.cookie("userType", userType, {
        //httpOnly: true,
        maxAge: 3600000,
    });
    return res;
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userRecord = await mongoose.model("Username").findById({ _id: username });
        if (!userRecord) {
            return res.status(404).json({ message: "Username not found" });
        }

        const user = await mongoose.model(userRecord.userType).findOne({ username });
        if (!user) {
            return res
                .status(404)
                .json({ message: `No user found with the username: ${username}` });
        }

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) {
        //     return res.status(401).json({ message: "Invalid credentials" });
        // }

        // for test with no encryption
        if (password !== user.password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        assignCookies(res, userRecord.userType, user._id)
            .status(200)
            .json({ message: "Login successful", token, user });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
