import mongoose from "mongoose";
import { validateReference, validateReferences } from "./validatingUtils.js";

const landmarkSchema = new mongoose.Schema(
    {
        governorID: { type: mongoose.Schema.Types.ObjectId, ref: "Governor" },
        description: String,
        pictures: [String],
        location: String,
        ticketPrices: { type: Map, of: Number },
        openingHours: [
            {
                day: {
                    type: String,
                    enum: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                    ],
                },
                open: Date,
                close: Date, // hours and minutes only
            },
        ],
        tags: [{ type: String, ref: "Tag" }],
    },
    { timestamps: true }
);

landmarkSchema.pre("save", async function (next) {
  try {
    const { governorID, tags } = this;

    if (governorID) {
      await validateReference(governorID, "Governor", next);
    }

    if (tags && tags.length > 0) {
      await validateReferences(tags, "Tag", next);
    }

    next();
  } catch (error) {
    next(error);
  }
});

const validateReferencesMiddleware = async function (next) {
  try {
    const update = this.getUpdate();
    const updatedGovernorID = update.governorID || update["$set.governorID"];
    const updatedTags = update.tags || update["$set.tags"];

    if (updatedGovernorID) {
      await validateReference(updatedGovernorID, "Governor", next);
    }

    if (updatedTags && updatedTags.length > 0) {
      await validateReferences(updatedTags, "Tag", next);
    }

    next();
  } catch (error) {
    next(error);
  }
};

landmarkSchema.pre("findOneAndUpdate", validateReferencesMiddleware);
landmarkSchema.pre("updateOne", validateReferencesMiddleware);
landmarkSchema.pre("findByIdAndUpdate", validateReferencesMiddleware);

landmarkSchema.index({ location: 1 });
export default mongoose.model("Landmark", landmarkSchema);
