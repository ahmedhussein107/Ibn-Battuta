import express from "express";
import { isAuthenticated } from "../routers.middleware/authentication.js";
const bookingRouter = express.Router();

import {
    getBookings,
    createBooking,
    redeemPoints,
    deleteBooking,
} from "../controllers/booking.controller.js";

bookingRouter.get("/getBookings", getBookings);

bookingRouter.post("/createBooking", isAuthenticated, createBooking);

bookingRouter.patch("/redeemPoints/:id", redeemPoints);

bookingRouter.delete("/deleteBooking/:id", deleteBooking);

export default bookingRouter;
