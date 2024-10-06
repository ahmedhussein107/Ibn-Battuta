import mongoose from "mongoose";
import { validateReference } from "./validatingUtils.js";

const customActivitySchema = new mongoose.Schema(
    {
        tourguideID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TourGuide",
            required: true,
        },
        title: String,
        description: String,
        location: String, // search for it in the lamdmarks
    },
    { timestamps: true }
);

customActivitySchema.index({ tourguideID: 1 });

customActivitySchema.pre("save", async function (next) {
  try {
    const { tourguideID } = this;

    await validateReference(tourguideID, "TourGuide", next);
    next();
  } catch (error) {
    next(error);
  }
});

const validateReferencesMiddleware = async function (next) {
  try {
    const update = this.getUpdate();
    const updatedTourguideID = update.tourguideID || update["$set.tourguideID"];

    if (updatedTourguideID) {
      await validateReference(updatedTourguideID, "TourGuide", next);
    }
    next();
  } catch (error) {
    next(error);
  }
};

customActivitySchema.pre("findOneAndUpdate", validateReferencesMiddleware);
customActivitySchema.pre("updateOne", validateReferencesMiddleware);
customActivitySchema.pre("findByIdAndUpdate", validateReferencesMiddleware);

export default mongoose.model("CustomActivity", customActivitySchema);
