import TourGuide from "../models/tourguide.model.js";
import Username from "../models/username.model.js";
import Email from "../models/email.model.js";
import Notification from "../models/notification.model.js";
import Rating from "../models/rating.model.js";
import Itinerary from "../models/itinerary.model.js";
import CustomActivity from "../models/customActivity.model.js";
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
            const newTourGuide = await TourGuide.create(req.body);
            res.status(201).json(newTourGuide);
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
    try {
        const tourGuide = await TourGuide.findById(req.params.id);
        if (tourGuide) {
            const {
                isAccepted,
                document,
                ratings,
                sumOfRatings,
                createdAt,
                updatedAt,
                __v,
                ...others
            } = tourGuide._doc;
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
    try {
        const tourGuide = await TourGuide.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (tourGuide) {
            res.status(200).json(tourGuide);
        } else {
            res.status(404).json({ e: "TourGuide not found" });
        }
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const deleteTourGuide = async (req, res) => {
    try {
        const tourGuide = await TourGuide.findByIdAndDelete(req.params.id);
        if (tourGuide) {
            await Username.findByIdAndDelete(tourGuide.username);
            await Email.findByIdAndDelete(tourGuide.email);

            // If there are notifications, delete each one
            if (tourGuide.notifications && tourGuide.notifications.length > 0) {
                await Promise.all(
                    tourGuide.notifications.map(async (notificationId) => {
                        await Notification.findByIdAndDelete(notificationId);
                    })
                );
            }

            // If there are ratings, delete each one
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
    } catch (e) {
        //console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};
