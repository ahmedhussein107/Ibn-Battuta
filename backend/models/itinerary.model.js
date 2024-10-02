import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    tourguideID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourGuide",
      required: true,
    },
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
    language: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableDatesAndTimes:{
      type: [Date],
      required: true,
    },
    accessibility: {
      type: [String],
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
    isActivated: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    sumOfRatings: Number,
  },
  { timestamps: true }
);




// Middleware to validate references on `save`
itinerarySchema.pre("save", async function (next) {
  try {
    // Validate tourguideID reference
    if (this.tourguideID) {
      const tourGuideExists = await mongoose
        .model("TourGuide")
        .exists({ _id: this.tourguideID });
      if (!tourGuideExists) {
        return next(
          new Error(`TourGuide with ID ${this.tourguideID} does not exist.`)
        );
      }
    }

    // Validate each Activity reference in the activities array
    for (const activityID of this.activities) {
      const activityExists = await mongoose
        .model("Activity")
        .exists({ _id: activityID });
      if (!activityExists) {
        return next(
          new Error(`Activity with ID ${activityID} does not exist.`)
        );
      }
    }

    // Validate each Rating reference in the ratings array
    for (const ratingID of this.ratings) {
      const ratingExists = await mongoose
        .model("Rating")
        .exists({ _id: ratingID });
      if (!ratingExists) {
        return next(new Error(`Rating with ID ${ratingID} does not exist.`));
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});


// Helper function for validating multiple references
const validateReferences = async (modelName, ids) => {
  if (!Array.isArray(ids)) ids = [ids]; // Ensure the input is an array
  const invalidIds = [];
  for (const id of ids) {
    const exists = await mongoose.model(modelName).exists({ _id: id });
    if (!exists) invalidIds.push(id);
  }
  return invalidIds;
};

const validateReferencesMiddleware = async function (next) {
  try {
    const update = this.getUpdate();

    // Check and validate `tourguideID` if being updated
    if (update.tourguideID) {
      const invalidTourGuide = await validateReferences(
        "TourGuide",
        update.tourguideID
      );
      if (invalidTourGuide.length > 0) {
        return next(
          new Error(`TourGuide with ID ${update.tourguideID} does not exist.`)
        );
      }
    }

    // Validate `activities` array updates (replacement)
    if (update.activities && Array.isArray(update.activities)) {
      const invalidActivities = await validateReferences(
        "Activity",
        update.activities
      );
      if (invalidActivities.length > 0) {
        return next(
          new Error(`Activities with IDs ${invalidActivities} do not exist.`)
        );
      }
    }

    // Handle `$push` and `$addToSet` for `activities`
    const activitiesUpdate =
      update.$push?.activities || update.$addToSet?.activities;
    if (activitiesUpdate) {
      const invalidActivities = await validateReferences(
        "Activity",
        activitiesUpdate
      );
      if (invalidActivities.length > 0) {
        return next(
          new Error(`New Activity with ID ${invalidActivities} does not exist.`)
        );
      }
    }

    // Validate `ratings` array updates (replacement)
    if (update.ratings && Array.isArray(update.ratings)) {
      const invalidRatings = await validateReferences("Rating", update.ratings);
      if (invalidRatings.length > 0) {
        return next(
          new Error(`Ratings with IDs ${invalidRatings} do not exist.`)
        );
      }
    }

    // Handle `$push` and `$addToSet` for `ratings`
    const ratingsUpdate = update.$push?.ratings || update.$addToSet?.ratings;
    if (ratingsUpdate) {
      const invalidRatings = await validateReferences("Rating", ratingsUpdate);
      if (invalidRatings.length > 0) {
        return next(
          new Error(`New Rating with ID ${invalidRatings} does not exist.`)
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Attach the middleware to multiple update methods
itinerarySchema.pre("findOneAndUpdate", validateReferencesMiddleware);
itinerarySchema.pre("updateOne", validateReferencesMiddleware);
itinerarySchema.pre("updateMany", validateReferencesMiddleware);
itinerarySchema.pre("findByIdAndUpdate", validateReferencesMiddleware);


export default mongoose.model("Itinerary", itinerarySchema);
