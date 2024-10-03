import mongoose from "mongoose";

// total price is price of existing activities + landmark ticketPrices

const itinerarySchema = new mongoose.Schema(
  {
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
    accessibility: [String],
    tourguideID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourGuide",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableDatesAndTimes: {
      type: [Date],
      required: true,
    },
    pickup: {
      type: String,
      required: true,
    }, // Location link
    dropOff: {
      type: String,
      required: true,
    },
    tags: [{ type: String, ref: "Tag" }], // not ObjectID?
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

export default mongoose.model("Itinerary", itinerarySchema);
