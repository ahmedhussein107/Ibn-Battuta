import express from "express";
import { isAuthenticated } from "../routers.middleware/authentication.js";
const bookingRouter = express.Router();
import {
    getBookings,
    getBooking,
    updateBooking,
    createBooking,
    completeBooking,
    redeemPoints,
    deleteBooking,
    deleteBookings,
    getitineraryBookings,
    getActivityBookings,
    getHotelBookings,
    getFlightBookings,
    checkPossiblePackageFlight,
    checkPossiblePackageHotel,
} from "../controllers/booking.controller.js";

bookingRouter.get("/getBookings", getBookings);

bookingRouter.post("/createBooking", isAuthenticated, createBooking);

bookingRouter.get("/getBooking/:id", getBooking);

bookingRouter.patch("/updateBooking/:id", updateBooking);

bookingRouter.patch("/completeBooking/:id", isAuthenticated, completeBooking);

bookingRouter.patch("/redeemPoints/:id", redeemPoints);

bookingRouter.delete("/deleteBooking/:id", deleteBooking);

bookingRouter.delete("/deleteBookings", deleteBookings);

bookingRouter.get("/getItineraryBookings", isAuthenticated, getitineraryBookings);

bookingRouter.get("/getActivityBookings", isAuthenticated, getActivityBookings);

bookingRouter.get("/getHotelBookings", isAuthenticated, getHotelBookings);

bookingRouter.get("/getFlightBookings", isAuthenticated, getFlightBookings);

bookingRouter.get(
    "/checkPossiblePackageFlight",
    isAuthenticated,
    checkPossiblePackageFlight
);

bookingRouter.get(
    "/checkPossiblePackageHotel",
    isAuthenticated,
    checkPossiblePackageHotel
);

export default bookingRouter;
