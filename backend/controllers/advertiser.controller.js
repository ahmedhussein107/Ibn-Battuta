import Username from "../models/username.model.js";
import Email from "../models/email.model.js";
import Advertiser from "../models/advertiser.model.js";
import Notification from "../models/notification.model.js";
import Activity from "../models/activity.model.js";
import Bookings from "../models/bokkings.model.js";
import Rating from "../models/rating.model.js";
import bcrypt from "bcrypt";
import { assignCookies } from "./general.controller.js";

export const createAdvertiser = async (req, res) => {
    console.log(req.body);
    const inputUsername = req.body.username;
    const inputEmail = req.body.email;
    const username = await Username.findById(inputUsername);
    const email = await Email.findById(inputEmail);
    try {
        if (!username && !email) {
            const newUsername = await Username.create({
                _id: inputUsername,
                userType: "Advertiser",
            });
            const newEmail = await Email.create({
                _id: inputEmail,
            });
            // hashing password 10 times
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
            const newAdvertiser = await Advertiser.create(req.body);
            assignCookies(res, "Advertiser", newAdvertiser._id)
                .status(201)
                .json({ message: "Sign up successful" });
        } else {
            if (username) {
                res.status(400).json({ e: "Username already exists" });
            } else {
                res.status(400).json({ e: "Email already exists" });
            }
        }
    } catch (e) {
        console.log(e.message);
        await Username.findByIdAndDelete(inputUsername);
        await Email.findByIdAndDelete(inputEmail);
        res.status(400).json({ e: e.message });
    }
};

export const getAdvertisers = async (req, res) => {
    try {
        const advertisers = await Advertiser.find();
        res.status(200).json(advertisers);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};

export const getAdvertiserById = async (req, res) => {
    const advertiserId = req.user.userId;
    try {
        const advertiser = await Advertiser.findById(advertiserId);
        if (advertiser) {
            const { isAccepted, document, createdAt, updatedAt, __v, ...others } =
                advertiser._doc;
            res.status(200).json(others);
        } else {
            res.status(404).json({ e: "Advertiser not found" });
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};

export const updateAdvertiser = async (req, res) => {
    const advertiserId = req.user.userId;
    try {
        const advertiser = await Advertiser.findById(advertiserId);
        if (!advertiser) {
            return res.status(404).json({ message: "advertiser not found" });
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        if (req.body.email) {
            await Email.findByIdAndDelete(advertiser.email);
            await Email.create({
                _id: req.body.email,
            });
        }

        // Update advertiser details
        const updatedadvertiser = await Advertiser.findByIdAndUpdate(
            advertiserId,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json(updatedadvertiser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteAdvertiser = async (req, res) => {
    const advertiserId = req.user.userId;
    try {
        const upcomingActivities = await Activity.find({
            advertiserID: advertiserId,
            endDate: { $gte: new Date() },
        }).distinct("_id");

        // Then check if any of these activities have bookings
        const hasUpcoming = await Booking.exists({
            bookingType: "Activity",
            typeId: { $in: upcomingActivities },
        });
        if (hasUpcoming) {
            return res.status(400).json({
                message: "Cannot delete advertiser with upcoming bookings",
            });
        } else {
            const advertiser = await Advertiser.findByIdAndDelete(advertiserId);
            console.log("after find", advertiser);
            if (advertiser) {
                await Username.findByIdAndDelete(advertiser.username);
                await Email.findByIdAndDelete(advertiser.email);

                // If there are notifications, delete each one
                if (advertiser.notifications && advertiser.notifications.length > 0) {
                    await Promise.all(
                        advertiser.notifications.map(async (notificationId) => {
                            await Notification.findByIdAndDelete(notificationId);
                        })
                    );
                }
                // Delete all activities associated with the advertiser
                const activities = await Activity.find({ advertiserID: advertiser._id });
                if (activities.length > 0) {
                    // Delete each activity and its related ratings
                    await Promise.all(
                        activities.map(async (activity) => {
                            // Delete all ratings associated with this activity
                            if (activity.ratings && activity.ratings.length > 0) {
                                await Promise.all(
                                    activity.ratings.map(async (ratingId) => {
                                        await Rating.findByIdAndDelete(ratingId);
                                    })
                                );
                            }
                            // Delete the activity itself
                            await Activity.findByIdAndDelete(activity._id);
                        })
                    );
                }
                res.status(200).json({ message: "Advertiser deleted successfully" });
            } else {
                res.status(404).json({ e: "Advertiser not found" });
            }
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};

export const changeAdvertiserPassword = async (req, res) => {
    const advertiserId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    try {
        if (!oldPassword || !newPassword) {
            return res.status(400).json("Both old and new passwords are required");
        }
        const advertiser = await Advertiser.findById(advertiserId);
        if (!advertiser) {
            return res.status(404).json("advertiser not found");
        }
        const isMatch = await bcrypt.compare(oldPassword, advertiser.password);
        if (!isMatch) {
            return res.status(400).json("Incorrect old password");
        }
        advertiser.password = await bcrypt.hash(newPassword, 10);
        await advertiser.save();
        return res.status(200).json("Password changed successfully!");
    } catch (err) {
        console.error("Error changing password:", err);
        return res.status(400).json("An error occurred while changing the password");
    }
};

export const getAdvertisersDocuments = async (req, res) => {
    try {
        const advertisers = await Advertiser.find();
        const advertisersDocuments = advertisers.map((advertiser) => {
            return {
                username: advertiser.username,
                documents: advertiser.documents,
            };
        });
        res.status(200).json(advertisersDocuments);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};
