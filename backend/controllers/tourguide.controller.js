import TourGuide from "../models/tourguide.model.js";
import Username from "../models/username.model.js";
import Email from "../models/email.model.js";
import Notification from "../models/notification.model.js";
import Rating from "../models/rating.model.js";
import Itinerary from "../models/itinerary.model.js";
import CustomActivity from "../models/customActivity.model.js";
import Bookings from "../models/booking.model.js";
import bcrypt from "bcrypt";
import { assignCookies } from "./general.controller.js";
import Admin from "../models/admin.model.js";
export const createTourGuide = async (req, res) => {
    //console.log(req.body);
    const inputUsername = req.body.username;
    const inputEmail = req.body.email;
    const username = await Username.findById(inputUsername);
    const email = await Email.findById(inputEmail);
    try {
        if (!username && !email) {
            const newUsername = await Username.create({
                _id: inputUsername,
                userType: "TourGuide",
            });
            const newEmail = await Email.create({
                _id: inputEmail,
            });
            // hashing password 10 times
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
            const newTourGuide = await TourGuide.create(req.body);
            res.status(201).json({ message: "Sign up successful", user: newTourGuide });
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

export const getTourGuides = async (req, res) => {
    try {
        const tourGuides = await TourGuide.find();
        res.status(200).json(tourGuides);
    } catch (e) {
        // console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};

export const getTourGuideById = async (req, res) => {
    const tourguideId = req.user.userId;
    try {
        const tourGuide = await TourGuide.findById(tourguideId);
        if (tourGuide) {
            const { isAccepted, documents, createdAt, updatedAt, __v, ...others } =
                tourGuide._doc;
            res.status(200).json(others);
        } else {
            res.status(404).json({ e: "TourGuide not found" });
        }
    } catch (e) {
        //console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};

export const getTourGuide = async (req, res) => {
    const tourguideId = req.params.id;
    try {
        const tourGuide = await TourGuide.findById(tourguideId);
        if (tourGuide) {
            const { isAccepted, documents, createdAt, updatedAt, __v, ...others } =
                tourGuide._doc;
            res.status(200).json(others);
        } else {
            res.status(404).json({ e: "TourGuide not found" });
        }
    } catch (e) {
        //console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};

export const updateTourGuide = async (req, res) => {
    let tourguideId = req.user.userId;
    const admin = await Admin.findById(req.user.userId);
    if (admin) {
        tourguideId = req.query.userId;
    }
    console.log("ahmed");
    console.log(tourguideId);
    try {
        const tourGuide = await TourGuide.findById(tourguideId);
        if (!tourGuide) {
            return res.status(404).json({ message: "tourGuide not found" });
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        if (req.body.email) {
            await Email.findByIdAndDelete(tourGuide.email);
            await Email.create({
                _id: req.body.email,
            });
        }

        // Update tourGuide details
        const updatedtourGuide = await TourGuide.findByIdAndUpdate(
            tourguideId,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json(updatedtourGuide);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteTourGuide = async (req, res) => {
    let tourguideId = req.user.userId;
    try {
        const upcomingItineraries = await Itinerary.find({
            tourguideID: tourguideId,
            availableDatesAndTimes: { $gte: new Date() },
        }).distinct("_id");

        const hasUpcoming = await Bookings.exists({
            bookingType: "Itinerary",
            typeId: { $in: upcomingItineraries },
        });

        if (hasUpcoming) {
            return res.status(400).json({
                message: "Cannot delete tour guide with upcoming itineraries",
            });
        } else {
            const admin = await Admin.findById(req.user.userId);
            if (admin) {
                tourguideId = req.query.userId;
            }
            const tourGuide = await TourGuide.findByIdAndDelete(tourguideId);
            console.log(tourGuide);
            if (tourGuide) {
                await Username.findByIdAndDelete(tourGuide.username);
                await Email.findByIdAndDelete(tourGuide.email);

                if (tourGuide.notifications && tourGuide.notifications.length > 0) {
                    await Promise.all(
                        tourGuide.notifications.map(async (notificationId) => {
                            await Notification.findByIdAndDelete(notificationId);
                        })
                    );
                }

                if (tourGuide.ratings && tourGuide.ratings.length > 0) {
                    await Promise.all(
                        tourGuide.ratings.map(async (ratingId) => {
                            await Rating.findByIdAndDelete(ratingId);
                        })
                    );
                }

                // Delete related itineraries
                const itineraries = await Itinerary.find({ tourguideID: tourGuide._id });
                if (itineraries.length > 0) {
                    await Promise.all(
                        itineraries.map(async (itinerary) => {
                            // Delete ratings associated with each itinerary
                            if (itinerary.ratings && itinerary.ratings.length > 0) {
                                await Promise.all(
                                    itinerary.ratings.map(async (ratingId) => {
                                        await Rating.findByIdAndDelete(ratingId);
                                    })
                                );
                            }
                            await Itinerary.findByIdAndDelete(itinerary._id);
                        })
                    );
                }

                // Delete related custom activities
                const customActivities = await CustomActivity.find({
                    tourguideID: tourGuide._id,
                });
                if (customActivities.length > 0) {
                    await Promise.all(
                        customActivities.map(async (customActivity) => {
                            await CustomActivity.findByIdAndDelete(customActivity._id);
                        })
                    );
                }

                res.status(200).json({ message: "TourGuide deleted successfully" });
            } else {
                res.status(404).json({ e: "TourGuide not found" });
            }
        }
    } catch (e) {
        //console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};

export const changeTourguidePassword = async (req, res) => {
    const tourguideId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    try {
        if (!oldPassword || !newPassword) {
            return res
                .status(400)
                .json({ message: "Both old and new passwords are required" });
        }
        const tourguide = await TourGuide.findById(tourguideId);
        if (!tourguide) {
            return res.status(404).json({ message: "tourguide not found" });
        }
        const isMatch = await bcrypt.compare(oldPassword, tourguide.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }
        tourguide.password = await bcrypt.hash(newPassword, 10);
        await tourguide.save();
        return res.status(200).json({ message: "Password changed successfully!" });
    } catch (err) {
        console.error("Error changing password:", err);
        return res
            .status(400)
            .json({ message: "An error occurred while changing the password" });
    }
};

export const getTourGuidesDocuments = async (req, res) => {
    try {
        const tourGuides = await TourGuide.find();
        const tourGuidesDocuments = tourGuides.map((tourGuide) => {
            return {
                username: tourGuide.username,
                documents: tourGuide.documents,
            };
        });
        res.status(200).json(tourGuidesDocuments);
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};
