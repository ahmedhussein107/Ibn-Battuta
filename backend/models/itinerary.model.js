import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
    language: String,
    price: Number,
    availableDatesAndTimes: [Date],
    accessibility: [String],
    pickup: String, // Location link
    dropOff: String,
    isActivated: { type: Boolean, default: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tourist" }],
    isFlagged: { type: Boolean, default: false },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
  },
  { timestamps: true }
);

export default mongoose.model("Itinerary", itinerarySchema);
