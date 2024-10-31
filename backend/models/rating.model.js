import mongoose from "mongoose";
import { validateReference } from "./validatingUtils.js";

const ratingSchema = new mongoose.Schema(
    {
        touristID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tourist",
        },
        rating: Number,
        comment: String,
    },
    { timestamps: true }
);

const validateTouristID = async (touristID, next) => {
    try {
        if (!touristID) {
            return next(new Error("touristID is required."));
        }
        await validateReference(touristID, "Tourist", next);
    } catch (err) {
        return next(err);
    }
};

ratingSchema.pre("save", async function (next) {
    try {
        const { touristID } = this;
        await validateTouristID(touristID, next);
    } catch (error) {
        next(error);
    }
});

const validateUpdateTouristID = async function (next) {
    try {
        const update = this.getUpdate();
        const updatedTouristID = update.touristID || update["$set"].touristID;

        if (updatedTouristID) {
            await validateTouristID(updatedTouristID, next);
        }

        next();
    } catch (error) {
        next(error);
    }
};

ratingSchema.pre("findOneAndUpdate", validateUpdateTouristID);
ratingSchema.pre("updateOne", validateUpdateTouristID);
ratingSchema.pre("findByIdAndUpdate", validateUpdateTouristID);

export default mongoose.model("Rating", ratingSchema);
