import { mongoose } from "mongoose";
import { validateReference, validateReferences } from "./validatingUtils.js";
const tourGuideSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            ref: "Username",
            required: true,
        },
        password: { type: String, required: true },
        name: { type: String, required: true },
        email: {
            type: String,
            ref: "Email",
            required: true,
        },
        isAccepted: { type: Boolean, default: true },
        document: [String],
        mobileNumber: { type: String, default: "Enter your Mobile Number" },
        yearsOfExperience: { type: Number, default: 0 },
        previousWork: { type: String, default: "No Previous Work" },
        picture: String,
        notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
        ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
        sumOfRatings: { type: Number, default: 0 },
    },
    { timestamps: true }
);

tourGuideSchema.pre("save", async function (next) {
    try {
        const { username, email, notifications, ratings } = this;

        await validateReference(username, "Username", next);

        if (email) {
            await validateReference(email, "Email", next);
        }

        if (notifications) {
            await validateReferences(notifications, "Notification", next);
        }
        if (ratings) {
            await validateReferences(ratings, "Rating", next);
        }

        next();
    } catch (error) {
        next(error);
    }
});

const validateUpdateReferences = async function (next) {
    try {
        const update = this.getUpdate();
        const username = update.username || update["$set.username"];
        const email = update.email || update["$set.email"];
        const notifications = update.notifications || update["$set.notifications"];
        const ratings = update.ratings || update["$set.ratings"];

        if (username) {
            await validateReference(username, "Username", next);
        }

        if (email) {
            await validateReference(email, "Email", next);
        }

        if (notifications) {
            await validateReferences(notifications, "Notification", next);
        }

        if (ratings) {
            await validateReferences(ratings, "Rating", next);
        }

        next();
    } catch (error) {
        next(error);
    }
};

tourGuideSchema.pre("findOneAndUpdate", validateUpdateReferences);
tourGuideSchema.pre("updateOne", validateUpdateReferences);
tourGuideSchema.pre("findByIdAndUpdate", validateUpdateReferences);
export default mongoose.model("TourGuide", tourGuideSchema);
