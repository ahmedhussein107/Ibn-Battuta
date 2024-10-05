import mongoose from "mongoose";
import { validateReference, validateReferences } from "./validatingUtils.js";

// total price is price of existing activities + landmark ticketPrices

const itinerarySchema = new mongoose.Schema(
  {
    tourguideID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourGuide",
      required: true,
    },
    activities: { type: [
        {
          activityType: {
            type: String,
            enum: ["Activity", "CustomActivity"],
            required: true,
          },
          activity: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "activityType",
            required: true,
          },
          startTime: Date, // to be upadated
          endTime: Date, // to be updated
        },
      ],
      default: []
    },
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

// tourguide, tags, rating, activities;

const validateTourguideID = async (tourguideID, next) => {
  try {
    if (!tourguideID) {
      return next(new Error("tourguideID is required."));
    }
    await validateReference(tourguideID, "TourGuide", next);
  } catch (err) {
    return next(err);
  }
};

const validateActivities = async (activities, next) => {
  try {
    const validModels = ["Activity", "CustomActivity"];
    for (const activityObj of activities) {
      const { activityType, activity } = activityObj;
      if (!validModels.includes(activityType)) {
        return next(new Error(`Invalid activityType: ${activityType}`));
      }
      await validateReference(activity, activityType, next);
    }
  } catch (err) {
    return next(err);
  }
};

const validateTags = async (tags, next) => {
  try {
    if (tags && tags.length) {
      await validateReferences(tags, "Tag", next);
    }
  } catch (err) {
    return next(err);
  }
};

const validateRatings = async (ratings, next) => {
  try {
    if (ratings && ratings.length) {
      await validateReferences(ratings, "Rating", next);
    }
  } catch (err) {
    return next(err);
  }
};

itinerarySchema.pre("save", async function (next) {
  try {
    const { tourguideID, activities, tags, ratings } = this;

    await validateTourguideID(tourguideID, next);
    await validateActivities(activities, next);
    await validateTags(tags, next);
    await validateRatings(ratings, next);
  } catch (error) {
    next(error);
  }
});

const validateUpdateItinerary = async function (next) {
  try {
    const update = this.getUpdate();

    const tourguideID = update.tourguideID || update["$set.tourguideID"];
    const activities = update.activities || update["$set.activities"];
    const tags = update.tags || update["$set.tags"];
    const ratings = update.ratings || update["$set.ratings"];

    if (tourguideID) {
      await validateTourguideID(tourguideID, next);
    }
    if (activities) {
      await validateActivities(activities, next);
    }
    if (tags) {
      await validateTags(tags, next);
    }
    if (ratings) {
      await validateRatings(ratings, next);
    }
    next();
  } catch (error) {
    next(error);
  }
};

itinerarySchema.pre("findOneAndUpdate", validateUpdateItinerary);
itinerarySchema.pre("updateOne", validateUpdateItinerary);
itinerarySchema.pre("findByIdAndUpdate", validateUpdateItinerary);


itinerarySchema.index({ tourguideID: 1 });

export default mongoose.model("Itinerary", itinerarySchema);
