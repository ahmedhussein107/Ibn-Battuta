import { mongoose } from "mongoose";

const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    advertiserID: { type: Schema.Types.ObjectId, ref: "Advertiser" },
    location: String,
    date: Date,
    duration: Number, // for change
    priceRange: [Number], // for change
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    toBeNotifiedTourists: [{ type: Schema.Types.ObjectId, ref: "Tourist" }], // for change
    isOpenForBooking: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
    sumOfRatings: Number,
    freeSpots: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
