import Username from "../models/username.model.js";
import Email from "../models/email.model.js";
import Advertiser from "../models/advertiser.model.js";
import Notification from "../models/notification.model.js";
import Activity from "../models/activity.model.js";
import Rating from "../models/rating.model.js";

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
            const newAdvertiser = await Advertiser.create(req.body);
            res.status(201).json(newAdvertiser);
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
    try {
        const advertiser = await Advertiser.findById(req.params.id);
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
    try {
        const advertiser = await Advertiser.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (advertiser) {
            res.status(200).json(advertiser);
        } else {
            res.status(404).json({ e: "Advertiser not found" });
        }
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};

export const deleteAdvertiser = async (req, res) => {
    try {
        const advertiser = await Advertiser.findByIdAndDelete(req.params.id);
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
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};
