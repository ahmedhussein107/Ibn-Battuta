import { mongoose } from "mongoose";
const { Schema } = mongoose;

const activitySchema = new mongoose.Schema(
  {
    advertiserID: { type: mongoose.Schema.Types.ObjectId, ref: "Advertiser" },
    location: String,
    date: Date,
    duration: Number, // for change
    priceRange: [Number], // for change
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    toBeNotifiedTourists: [{ type: Schema.Types.ObjectId, ref: "Tourist" }], // for change
    isOpenForBooking: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
    sumOfRatings: { type: Number, default: 0 },
    freeSpots: { type: Number, required: true },
  },
  { timestamps: true }
);

activitySchema.index({ advertiserID: 1 });

export default mongoose.model("Activity", activitySchema);
