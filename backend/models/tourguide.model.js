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
        isAccepted: { type: Boolean, default: false },
        documents: [String],
        mobile: { type: String, default: null },
        yearsOfExperience: { type: Number, default: null },
        previousWork: [
            {
                title: { type: String, required: true },
                duration: { type: Number, required: true },
                description: { type: String, default: null },
            },
        ],
        picture: String,
        notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notification" }],
        ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
        sumOfRatings: { type: Number, default: 0 },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourGuideSchema.methods.addRating = async function (rating) {
    this.ratings.push(rating);
    this.sumOfRatings += rating.rating;
    await this.save();
};

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

tourGuideSchema.virtual("rating").get(function () {
    // Ensure ratings is not empty to avoid division by zero
    if (this.ratings && this.ratings.length > 0) {
        return this.sumOfRatings / this.ratings.length;
    }
    return -1; // Return -1 if there are no ratings and handle in frontend
});

export default mongoose.model("TourGuide", tourGuideSchema);
