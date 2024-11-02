import expressWs from "express-ws";
import Notification from "../models/notification.model.js";
import { wsIsAuthenticate } from "../routers.middleware/authentication.js";
const activeUsers = {};

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
                // next line for testing
                //sendNotificationCountToUser("6724dffdcebc91210f7074b3", "Admin");

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

function sendNotificationCountToUser(userId, userType) {
    const userKey = `${userId}_${userType}`;
    const ws = activeUsers[userKey];
    console.log("Sending notification count to user:", userKey);
    if (ws && ws.readyState === ws.OPEN) {
        // TODO logic of counting unread notifications is to be updated
        ws.send(JSON.stringify({ type: "notificationCount", count: 4 }));
    }
}

export { setupWebSocketRoutes, sendNotificationCountToUser };
