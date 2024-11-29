import mongoose from "mongoose";
import { validateReference, validateReferences } from "./validatingUtils.js";

const complaintSchema = new mongoose.Schema(
    {
        touristID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tourist",
            required: true,
        },
        title: { type: String, default: "your complaint" },
        body: { type: String, required: true },
        status: { type: String, enum: ["resolved", "pending"], default: "pending" },
        replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    },
    { timestamps: true }
);

complaintSchema.pre("save", async function (next) {
    try {
        const { touristID, replies } = this;

        await validateReference(touristID, "Tourist", next);
        if (replies) {
            await validateReferences(replies, "Comment", next);
        }
        next();
    } catch (error) {
        next(error);
    }
});

const validateReferencesMiddleware = async function (next) {
    try {
        const update = this.getUpdate();
        const updatedTouristID = update.touristID || update["$set.touristID"];
        const updatedReplies = update.replies || update["$push.replies"];

        if (!updatedTouristID && !updatedReplies) {
            return next();
        }

        if (updatedTouristID) {
            await validateReference(updatedTouristID, "Tourist", next);
        }
        if (updatedReplies) {
            await validateReference(updatedReplies, "Comment", next);
        }
        next();
    } catch (error) {
        next(error);
    }
};

complaintSchema.pre("findOneAndUpdate", validateReferencesMiddleware);
complaintSchema.pre("updateOne", validateReferencesMiddleware);
complaintSchema.pre("findByIdAndUpdate", validateReferencesMiddleware);

export default mongoose.model("Complaint", complaintSchema);
