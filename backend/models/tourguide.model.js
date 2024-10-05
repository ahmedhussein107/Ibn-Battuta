import { mongoose } from "mongoose";

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
        mobileNumber: String,
        yearsOfExperience: Number,
        previousWork: String,
        picture: String,
        notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
        ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
        sumOfRatings: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("TourGuide", tourGuideSchema);
