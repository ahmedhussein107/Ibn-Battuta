import { mongoose } from "mongoose";

const advertiserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            ref: "Username",
            required: true,
        },
        password: { type: String, required: true },
        email: { type: String, ref: "Email", required: true },
        name: { type: String, required: true },
        isAccepted: { type: Boolean, default: true },
        document: [String],
        website: String,
        hotline: String,
        companyProfile: String,
        picture: String,
        notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
    },
    { timestamps: true }
);

export default mongoose.model("Advertiser", advertiserSchema);
