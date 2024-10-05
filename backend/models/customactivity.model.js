import mongoose from "mongoose";

const customActivitySchema = new mongoose.Schema(
    {
        tourguideID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TourGuide",
            required: true,
        },
        title: String,
        description: String,
        location: String, // search for it in the lamdmarks
    },
    { timestamps: true }
);

customActivitySchema.index({ tourguideID: 1 });

export default mongoose.model("CustomActivity", customActivitySchema);
