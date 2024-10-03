import express from "express";
import Booking from "../models/booking.model.js";

const bookingRouter = express.Router();

bookingRouter.post("/createBooking", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

bookingRouter.get("/getBookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

bookingRouter.delete("/deleteBooking/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

bookingRouter.put("/updateBooking/:id", async (req, res) => {
  try {
    const admin = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!admin) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default bookingRouter;
