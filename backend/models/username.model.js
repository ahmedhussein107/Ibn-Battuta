import mongoose from "mongoose";

const usernameSchema = new mongoose.Schema(
    {
        _id: String,
        userType: {
            type: String,
            enum: ["Tourist", "TourGuide", "Seller", "Governor", "Advertiser", "Admin"],
            required: true,
        },
        otp: { type: String, default: null },
    },
    { timestamps: true }
);

export default mongoose.model("Username", usernameSchema);
