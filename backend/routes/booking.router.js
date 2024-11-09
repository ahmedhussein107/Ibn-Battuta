import express from "express";

const bookingRouter = express.Router();
import { isAuthenticated } from "../routers.middleware/authentication.js";
import {
    getBookings,
    createBooking,
    redeemPoints,
    deleteBooking,
    getitineraryBookings,
    getActivityBookings,
} from "../controllers/booking.controller.js";

bookingRouter.get("/getBookings", getBookings);

bookingRouter.post("/createBooking", createBooking);

bookingRouter.patch("/redeemPoints/:id", redeemPoints);

bookingRouter.delete("/deleteBooking/:id", deleteBooking);

bookingRouter.get("/getitineraryBookings", isAuthenticated, getitineraryBookings);

bookingRouter.get("/getActivityBookings", isAuthenticated, getActivityBookings);

export default bookingRouter;
