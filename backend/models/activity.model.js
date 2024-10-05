import { mongoose, Schema } from "mongoose";

const activitySchema = new Schema(
    {
        advertiserID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Advertiser",
            required: true,
        },
        location: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        price: Number,
        category: { type: String, ref: "Category" },
        tags: [{ type: String, ref: "Tag" }],
        ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
        toBeNotifiedTourists: [{ type: Schema.Types.ObjectId, ref: "Tourist" }],
        isOpenForBooking: { type: Boolean, default: true },
        isFlagged: { type: Boolean, default: false },
        sumOfRatings: { type: Number, default: 0 },
        freeSpots: { type: Number, required: true },
        specialDiscount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

activitySchema.index({ advertiserID: 1 });

export default mongoose.model("Activity", activitySchema);
