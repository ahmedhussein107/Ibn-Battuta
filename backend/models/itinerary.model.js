import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    tourguideID: { type: mongoose.Schema.Types.ObjectId, ref: "TourGuide" },
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
    language: String,
    price: Number,
    availableDatesAndTimes: [Date],
    accessibility: [String],
    pickup: String, // Location link
    dropOff: String,
    isActivated: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    sumOfRatings: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Itinerary", itinerarySchema);
