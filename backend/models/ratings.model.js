import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    touristID: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist" },
    rating: Number,
    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
