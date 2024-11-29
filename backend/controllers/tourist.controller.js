import Tourist from "../models/tourist.model.js";
import Username from "../models/username.model.js";
import Email from "../models/email.model.js";
import Notification from "../models/notification.model.js";
import TouristActivityNotification from "../models/touristActivityNotification.model.js";
import bcrypt from "bcrypt";
import { assignCookies } from "./general.controller.js";
import Admin from "../models/admin.model.js";
import Complaint from "../models/complaint.model.js";
import Booking from "../models/booking.model.js";
import TouristBookmark from "../models/touristBookmark.model.js";

export const getTourists = async (req, res) => {
    try {
        const tourguides = await Tourist.find();
        res.json(tourguides);
    } catch (e) {
        res.json(e.message);
        //console.log(e.message);
    }
};

export const getTouristById = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(404).json({ e: "ID not found" });
        }

        const tourist = await Tourist.findById(userId);

        if (!tourist) {
            return res.status(404).json({ e: "Tourist not found" });
        }

        const age = tourist.age;
        const {
            cart,
            preferences,
            wishlist,
            deliveryAddresses,
            createdAt,
            updatedAt,
            __v,
            DOB,
            ...other
        } = tourist._doc;

        console.log(other);
        res.status(200).json({ ...other, age, preferences });
    } catch (e) {
        console.error(e.message); // Log the error for debugging
        res.status(400).json({ e: e.message });
    }
};

export const createTourist = async (req, res) => {
    console.log(req.body);
    const inputUsername = req.body.username;
    const inputEmail = req.body.email;
    const username = await Username.findById(inputUsername);
    const email = await Email.findById(inputEmail);
    try {
        if (!username && !email) {
            const newUsername = await Username.create({
                _id: inputUsername,
                userType: "Tourist",
            });
            const newEmail = await Email.create({
                _id: inputEmail,
            });

            // hashing password 10 times
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
            const { address, ...body } = req.body;
            const newTourist = await Tourist.create(body);
            assignCookies(
                res,
                "Tourist",
                newTourist._id,
                newTourist.picture,
                newTourist.currency
            )
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
        await Username.findByIdAndDelete(inputUsername);
        await Email.findByIdAndDelete(inputEmail);
        res.status(400).json({ e: e.message });
    }
};

export const updateTourist = async (req, res) => {
    try {
        let ID = req.user.userId;
        const admin = await Admin.findById(req.user.userId);
        if (admin) {
            ID = req.query.userId;
        }
        const tourist = await Tourist.findById(ID);
        if (!tourist) {
            return res.status(404).json({ e: "Tourist not found" });
        }
        if (req.body.email) {
            await Email.findByIdAndDelete(tourist.email);
            await Email.create({
                _id: req.body.email,
            });
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const touristUpdated = await Tourist.findByIdAndUpdate(ID, req.body, {
            new: true,
        });

        res.cookie("currency", touristUpdated.currency, {
            maxAge: 60 * 60 * 24 * 1000,
        })
            .status(200)
            .json({ message: "Tourist updated", tourist: touristUpdated });
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const deleteTourist = async (req, res) => {
    try {
        let touristID = req.user.userId;
        const admin = await Admin.findById(req.user.userId);
        if (admin) {
            touristID = req.query.userId;
        }
        const currentTourist = await Tourist.findById(touristID);

        // Check for bookings first
        if (currentTourist) {
            const hasBookings =
                (await Booking.find({
                    touristID: touristID,
                }).countDocuments()) > 0;
            if (hasBookings) {
                return res
                    .status(400)
                    .json({ message: "Cannot delete tourist with bookings" });
            }
        }

        // If current tourist doesn't exist, check if the user is an admin
        const ID = touristID;

        const tourist = await Tourist.findByIdAndDelete(ID);
        if (tourist) {
            await Username.findByIdAndDelete(tourist.username);
            await Email.findByIdAndDelete(tourist.email);

            // Delete notifications
            if (tourist.notifications && tourist.notifications.length > 0) {
                await Promise.all(
                    tourist.notifications.map((notificationId) =>
                        Notification.findByIdAndDelete(notificationId)
                    )
                );
            }

            // Delete complaints
            if (tourist.complaints && tourist.complaints.length > 0) {
                await Promise.all(
                    tourist.complaints.map((complaintId) =>
                        Complaint.findByIdAndDelete(complaintId)
                    )
                );
            }

            // Delete related tourist activity notifications
            await TouristActivityNotification.deleteMany({
                touristID: tourist._id,
            });

            return res.status(200).json({
                message: "Tourist deleted successfully",
            });
        } else {
            return res.status(404).json({ message: "Tourist not found" });
        }
    } catch (e) {
        res.status(500).json({ error: e.message }); // Use 500 for internal server errors
    }
};

export const redeemPoints = async (req, res) => {
    try {
        const tourist = await Tourist.findById(req.user.userId);
        if (!tourist) {
            return res.status(404).json({ e: "Tourist not found" });
        }
        const { points } = req.body;
        if (points < 0 || points > (tourist.loyalityPoints || 0)) {
            return res.status(400).json({ e: "Not enough points" });
        }

        // Assuming the conversion is 10000 points = $100
        const cashValue = (points / 10000) * 100;

        tourist.loyalityPoints -= points; // Deducting points
        tourist.wallet += cashValue; // Adding cash value to the wallet
        await tourist.save(); // Save the updated tourist details

        res.status(200).json({
            message: "Points redeemed successfully",
            cashValue,
        });
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const addPreference = async (req, res) => {
    try {
        const tourist = await Tourist.findById(req.user.userId);
        if (!tourist) {
            return res.status(404).json({ e: "Tourist not found" });
        }
        const { preference } = req.body;
        if (!preference) {
            return res.status(400).json({ e: "Preference is required" }); // Check for missing preference
        }
        if (tourist.preferences.includes(preference)) {
            return res.status(400).json({ e: "Preference already exists" });
        }
        tourist.preferences.push(preference);
        await tourist.save();
        res.status(200).json({ message: "Preference added successfully" });
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const removePreference = async (req, res) => {
    try {
        const tourist = await Tourist.findById(req.user.userId);
        if (!tourist) {
            return res.status(404).json({ e: "Tourist not found" });
        }
        const { preference } = req.body;
        const index = tourist.preferences.indexOf(preference);
        if (index === -1) {
            return res.status(400).json({ e: "Preference does not exist" });
        }
        tourist.preferences.splice(index, 1);
        await tourist.save();
        res.status(200).json({ message: "Preference removed successfully" });
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const changeTouristPassword = async (req, res) => {
    const touristId = req.user.userId; // Assuming userId is stored in the req.user object after authentication
    const { oldPassword, newPassword } = req.body;

    try {
        // Validate the input fields
        if (!oldPassword || !newPassword) {
            return res.status(400).json("Both old and new passwords are required");
        }

        // Find the tourist by ID
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            return res.status(404).json("Tourist not found");
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, tourist.password);
        if (!isMatch) {
            return res.status(400).json("Incorrect old password");
        }

        // Update the password
        tourist.password = await bcrypt.hash(newPassword, 10);
        await tourist.save();

        // Return success response
        return res.status(200).json("Password changed successfully!");
    } catch (err) {
        console.error("Error changing password:", err);
        return res.status(500).json("An error occurred while changing the password");
    }
};

export const toggleBookmark = async (req, res) => {
    const touristID = req.user.userId;
    const { bookmarkID, bookmarkType, isBookmarked } = req.body;

    try {
        if (isBookmarked) {
            const bookmark = await TouristBookmark.deleteOne({
                touristID,
                bookmarkType,
                bookmarkID,
            });
            res.status(200).json({ message: "Bookmark deleted successfully", bookmark });
        } else {
            const bookmark = await TouristBookmark.create({
                touristID,
                bookmarkType,
                bookmarkID,
            });
            res.status(200).json({ message: "Bookmark added successfully", bookmark });
        }
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const getBookmarkStatus = async (req, res) => {
    const touristID = req.user.userId;
    const bookmarkIDs = req.body.bookmarkIDs;
    const result = {};
    try {
        for (let i = 0; i < bookmarkIDs.length; i++) {
            const bookmark = await TouristBookmark.findOne({
                touristID,
                bookmarkID: bookmarkIDs[i],
            });
            if (bookmark) {
                result[bookmarkIDs[i]] = true;
            } else {
                result[bookmarkIDs[i]] = false;
            }
        }
        console.log("result", result);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const getActivityBookmarks = async (req, res) => {
    try {
        const id = req.user.userId;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const toSkip = (page - 1) * limit;
        let query = {
            touristID: id,
            bookmarkType: "Activity",
        };
        const count = await TouristBookmark.countDocuments(query);
        const bookings = await TouristBookmark.find(query)
            .skip(toSkip)
            .limit(limit)
            .populate("bookmarkID");
        res.status(200).json({
            result: bookings,
            totalPages: count > 0 ? Math.ceil(count / limit) : 1,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getItineraryBookmarks = async (req, res) => {
    try {
        const id = req.user.userId;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const toSkip = (page - 1) * limit;
        let query = {
            touristID: id,
            bookmarkType: "Itinerary",
        };
        const count = await TouristBookmark.countDocuments(query);
        const bookings = await TouristBookmark.find(query)
            .skip(toSkip)
            .limit(limit)
            .populate("bookmarkID");
        res.status(200).json({
            result: bookings,
            totalPages: count > 0 ? Math.ceil(count / limit) : 1,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
