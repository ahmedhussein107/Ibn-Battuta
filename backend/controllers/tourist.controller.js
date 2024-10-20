import Tourist from "../models/tourist.model.js";
import Username from "../models/username.model.js";
import Email from "../models/email.model.js";
import Notification from "../models/notification.model.js";
import Booking from "../models/booking.model.js";
import TouristActivityNotification from "../models/touristActivityNotification.model.js";

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
        const tourist = await Tourist.findById(req.params.id);
        if (tourist) {
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
            res.status(200).json({ ...other, age });
        } else {
            res.status(404).json({ e: "Tourist not found" });
        }
    } catch (e) {
        //console.log(e.message);
        res.status(400).json({ e: e.message });
    }
};

export const createTourist = async (req, res) => {
    //console.log(req.body);
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
            const newTourist = await Tourist.create(req.body);
            res.status(201).json(newTourist);
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
        const tourist = await Tourist.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(tourist);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};

export const deleteTourist = async (req, res) => {
    try {
        const tourist = await Tourist.findByIdAndDelete(req.params.id);
        if (tourist) {
            const hasUpcoming = await Booking.exists({
                touristID: req.params.id,
                $or: [
                    {
                        bookingType: "Activity",
                        typeId: {
                            $in: await Activity.find({
                                endDate: { $gt: new Date() },
                            }).distinct("_id"),
                        },
                    },
                    {
                        bookingType: "Itinerary",
                        typeId: {
                            $in: await Itinerary.find({
                                "activities.endTime": { $gt: new Date() },
                            }).distinct("_id"),
                        },
                    },
                ],
            });
            if (!hasUpcoming) {
                await Username.findByIdAndDelete(tourist.username);
                await Email.findByIdAndDelete(tourist.email);

                // If there are notifications, delete each one
                if (tourist.notifications && tourist.notifications.length > 0) {
                    await Promise.all(
                        tourist.notifications.map(async (notificationId) => {
                            await Notification.findByIdAndDelete(notificationId);
                        })
                    );
                }

                // Delete Entries in TouristActivityNotification related to this tourist
                await TouristActivityNotification.deleteMany({ touristID: tourist._id });

                res.status(200).json({ message: "Tourist deleted successfully" });
            } else {
                res.status(400).json({ message: "Tourist has upcoming bookings" });
            }
        } else {
            res.status(404).json({ e: "Tourist not found" });
        }
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};
