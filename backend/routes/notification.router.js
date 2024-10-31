import express from "express";
import Notification from "../models/notification.model.js";
const notificationRouter = express.Router();

notificationRouter.post("/createNotification", async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        res.json(notification);
    } catch (e) {
        res.json(e.message);
        console.log(e.message);
    }
});

notificationRouter.get("/allNotifications", async (req, res) => {
    try {
        const notification = await Notification.find();
        res.json(notification);
    } catch (e) {
        console.log(e.message);
    }
});

notificationRouter.patch("/updateNotification/:id", async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        if (!notification) return res.status(404).send("Notification not found.");
        res.json(notification);
    } catch (e) {
        res.json(e.message);
        console.log(e.message);
    }
});

export default notificationRouter;
