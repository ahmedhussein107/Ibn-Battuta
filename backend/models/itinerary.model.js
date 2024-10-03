import mongoose from "mongoose";

// total price is price of existing activities + landmark ticketPrices

const itinerarySchema = new mongoose.Schema(
  {
    tourguideID: { type: mongoose.Schema.Types.ObjectId, ref: "TourGuide" },
    existingActivities: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
    ],
    createdActivities: [
      {
        location: String, // if new
        title: String,
        description: String,

        landmark: { type: mongoose.Schema.Types.ObjectId, ref: "Landmark" },
        duration: { type: Number, required: true },
      },
    ],
    language: String,
    price: Number,
    availableDatesAndTimes: [Date],
    accessibility: [String],
    pickup: String, // Location link
    dropOff: String,
    isActivated: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    sumOfRatings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// add tags and category??

export default mongoose.model("Itinerary", itinerarySchema);
