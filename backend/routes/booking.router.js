import express from "express";
import { isAuthenticated } from "../routers.middleware/authentication.js";
const bookingRouter = express.Router();
import {
    getBookings,
    getBooking,
    updateBooking,
    createBooking,
    redeemPoints,
    deleteBooking,
    getitineraryBookings,
    getActivityBookings,
    getHotelBookings,
    getFlightBookings,
} from "../controllers/booking.controller.js";

bookingRouter.get("/getBookings", getBookings);

bookingRouter.post("/createBooking", isAuthenticated, createBooking);

bookingRouter.get("/getBooking/:id", getBooking);

bookingRouter.patch("/updateBooking/:id", updateBooking);

bookingRouter.patch("/redeemPoints/:id", redeemPoints);

bookingRouter.delete("/deleteBooking/:id", deleteBooking);

bookingRouter.get("/getItineraryBookings", isAuthenticated, getitineraryBookings);

bookingRouter.get("/getActivityBookings", isAuthenticated, getActivityBookings);

bookingRouter.get("/getHotelBookings", isAuthenticated, getHotelBookings);

bookingRouter.get("/getFlightBookings", isAuthenticated, getFlightBookings);

export default bookingRouter;
