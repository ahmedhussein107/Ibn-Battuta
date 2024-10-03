import { mongoose, Schema } from "mongoose";

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
    priceRange: Number, // for change
    category: { type: String, ref: "Category" },
    tags: [{ type: String, ref: "Tag" }],
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    landmark: [{ type: Schema.Types.ObjectId, ref: "Landmark" }],
    toBeNotifiedTourists: [{ type: Schema.Types.ObjectId, ref: "Tourist" }], // for change
    isOpenForBooking: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
    sumOfRatings: Number,
    freeSpots: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
