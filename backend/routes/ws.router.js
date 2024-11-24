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
            console.log("User found:", user.notifications);
            const unreadCount = user.notifications.filter(
                (notification) => !notification.isRead
            ).length;
            console.log("Unread count:", unreadCount);
            ws.send(JSON.stringify({ type: "notificationCount", count: unreadCount }));
            console.log("done");
        }
    }
}
function incrementnotificationCount(userId, userType) {
    const userKey = `${userId}_${userType}`;
    const ws = activeUsers[userKey];
    console.log("Incrementing notification count for user:", userKey);
    if (ws && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: "incrementNotificationCount" }));
    }
}

export { setupWebSocketRoutes, sendNotificationCountToUser, incrementnotificationCount };
