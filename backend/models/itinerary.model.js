import mongoose from "mongoose";

// total price is price of existing activities + landmark ticketPrices

const itinerarySchema = new mongoose.Schema(
  {
    tourguideID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourGuide",
      required: true,
    },
    activities: [
      {
        activityType: {
          type: String,
          enum: ["Activity", "CustomActivity"],
          required: true,
        },
        activity: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "activities.activityType",
          required: true,
        },
        startTime: Date, // to be upadated
        endTime: Date, // to be updated
      },
    ],
    language: String,
    accessibility: [String],
    price: { type: Number, required: true },
    availableDatesAndTimes: {
      type: [Date],
      required: true,
    },
    pickup: {
      type: String,
      required: true,
    },
    dropOff: {
      type: String,
      required: true,
    },
    tags: [{ type: String, ref: "Tag" }],
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

itinerarySchema.index({ tourguideID: 1 });

export default mongoose.model("Itinerary", itinerarySchema);
