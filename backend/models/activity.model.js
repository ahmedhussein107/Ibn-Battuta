import { mongoose } from "mongoose";
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  location: String,
  date: Date,
  duration: Number,
  priceRange: [Number],
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
  bookings: [{ type: Schema.Types.ObjectId, ref: "Tourist" }],
  toBeNotifiedTourists: [{ type: Schema.Types.ObjectId, ref: "Tourist" }],
  isOpenForBooking: { type: Boolean, default: true },
  isFlagged: { type: Boolean, default: false },
});

export default mongoose.model("Activity", activitySchema);
