import mongoose from "mongoose";
import { validateReference, validateReferences } from "./validatingUtils.js";

const landmarkSchema = new mongoose.Schema(
    {
        governorID: { type: mongoose.Schema.Types.ObjectId, ref: "Governor" },
        description: String,
        pictures: [String],
        location: String,
        latitude: Number,
        longitude: Number,
        ticketPrices: {
            foreigner: { type: Number, default: 0 },
            native: { type: Number, default: 0 },
            student: { type: Number, default: 0 },
        },
        name: { type: String, required: true },
        openingHours: {
            Monday: { open: Date, close: Date },
            Tuesday: { open: Date, close: Date },
            Wednesday: { open: Date, close: Date },
            Thursday: { open: Date, close: Date },
            Friday: { open: Date, close: Date },
            Saturday: { open: Date, close: Date },
            Sunday: { open: Date, close: Date },
        },
        tags: [{ type: String, ref: "LandmarkTag" }],
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
            await validateReferences(tags, "LandmarkTag", next);
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
            await validateReferences(updatedTags, "LandmarkTag", next);
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
