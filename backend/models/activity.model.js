import { mongoose } from "mongoose";
const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    advertiserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertiser",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    duration: Number, // for change
    priceRange: [Number], // for change
    category: { type: String, ref: "Category" },
    tags: [{ type: String, ref: "Tag" }],
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
