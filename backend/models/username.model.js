import mongoose from "mongoose";

const usernameSchema = new mongoose.Schema({
    _id: String,
    userType: {
        type: String,
        enum: ["Tourist", "TourGuide", "Seller", "Governor", "Advertiser"],
        required: true,
    },
});

export default mongoose.model("Username", usernameSchema);
