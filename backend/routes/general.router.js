import express from "express";
const generalRouter = express.Router();
import {
    updatePassword,
    markNotificationAsRead,
    login,
} from "../controllers/general.controller.js";

generalRouter.put("/updatePassword", updatePassword);
generalRouter.put("/markNotificationAsRead/:id", markNotificationAsRead);
generalRouter.post("/login", login);

export default generalRouter;
