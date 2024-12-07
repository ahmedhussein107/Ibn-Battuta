import expressWs from "express-ws";
import Notification from "../models/notification.model.js";
import { wsIsAuthenticate } from "../routers.middleware/authentication.js";
const activeUsers = {};
import mongoose from "mongoose";
function setupWebSocketRoutes(app) {
    expressWs(app);
    app.ws("/notifications", (ws, req) => {
        console.log("the token is: ", req.query.token);
        wsIsAuthenticate(ws, req, (ws, req) => {
            const userId = ws.user.userId;
            const userType = ws.user.userType;
            console.log("WebSocket connection established for user:", userId);
            if (userId && userType) {
                const userKey = `${userId}_${userType}`;
                activeUsers[userKey] = ws;

                console.log(`User ${userKey} connected via WebSocket`);
                sendNotificationCountToUser(userId, userType);

                ws.on("close", () => {
                    delete activeUsers[userKey];
                    console.log(`User ${userKey} disconnected`);
                });
            } else {
                ws.close();
            }
        });
    });
}

async function sendNotificationCountToUser(userId, userType) {
    if (userType === "Governor") return; // no noitifications list in the model

    const userKey = `${userId}_${userType}`;
    const ws = activeUsers[userKey];
    console.log("Sending notification count to user:", userKey);
    if (ws && ws.readyState === ws.OPEN) {
        console.log(2);
        const user = await mongoose
            .model(userType)
            .findById(userId)
            .populate("notifications");
        if (user) {
            const last_100 = user.notifications.slice(-100);
            const toRemove = user.notifications.slice(0, -100);

            user.notifications = last_100;

            try {
                user.save();
                console.log("Notifications trimmed in user document.");

                const idsToRemove = toRemove.map((notif) => notif._id);
                Notification.deleteMany({ _id: { $in: idsToRemove } });

                console.log("Notifications removed from Notifications collection.");
            } catch (error) {
                console.error("Error while trimming notifications:", error);
            }
            const unreadCount = user.notifications.filter(
                (notification) => !notification.isRead
            ).length;
            console.log("Unread count:", unreadCount);
            ws.send(
                JSON.stringify({
                    type: "initialNotifications",
                    count: unreadCount,
                    notifications: user.notifications,
                })
            );
            console.log("done");
        }
    }
}
function incrementnotificationCount(userId, userType, notification) {
    if (userType === "Governor") return; // no noitifications list in the model
    const userKey = `${userId}_${userType}`;
    const ws = activeUsers[userKey];
    console.log("Incrementing notification count for user:", userKey);
    if (ws && ws.readyState === ws.OPEN) {
        ws.send(
            JSON.stringify({
                type: "onlineNotification",
                notification: notification,
            })
        );
    }
}

export { setupWebSocketRoutes, sendNotificationCountToUser, incrementnotificationCount };
