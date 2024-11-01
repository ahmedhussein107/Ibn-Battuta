import express from "express";
import TouristActivityNotification from "../models/touristActivityNotification.model.js";
const touristActivityNotificationRouter = express.Router();

touristActivityNotificationRouter.post(
    "/createTouristActivityNotification",
    async (req, res) => {
        // Code to create a new touristActivityNotification goes here.
        try {
            const entry = await TouristActivityNotification.create(req.body);
            res.status(201).json(entry);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
);

touristActivityNotificationRouter.get(
    "/allTouristActivityNotifications",
    async (req, res) => {
        try {
            const entries = await TouristActivityNotification.find();
            res.json(entries);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);

touristActivityNotificationRouter.delete(
    "/deleteAllTouristActivityNotifications",
    async (req, res) => {
        try {
            await TouristActivityNotification.deleteMany();
            res.status(200).json({
                message: "All touristActivity notifications deleted",
            });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);

export default touristActivityNotificationRouter;
