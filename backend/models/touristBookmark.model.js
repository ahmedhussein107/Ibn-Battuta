import mongoose from "mongoose";

const touristBookmarkSchema = new mongoose.Schema(
    {
        touristID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tourist",
            required: true,
        },
        bookmarkType: {
            type: String,
            enum: ["Activity", "Itinerary"],
            required: true,
        },
        bookmarkID: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "bookmarkType",
            required: true,
        },
    },
    { timestamps: true }
);

touristBookmarkSchema.index({ touristID: 1 });
touristBookmarkSchema.index({ bookmarkID: 1 });

export default mongoose.model("TouristBookmark", touristBookmarkSchema);
