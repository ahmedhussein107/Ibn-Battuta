import express from "express";

const bookingRouter = express.Router();

import {
    getBookings,
    createBooking,
    redeemPoints,
    deleteBooking,
} from "../controllers/booking.controller.js";

bookingRouter.get("/getBookings", getBookings);

bookingRouter.post("/createBooking", createBooking);

bookingRouter.patch("/redeemPoints/:id", redeemPoints);

bookingRouter.delete("/deleteBooking/:id", deleteBooking);

export default bookingRouter;
