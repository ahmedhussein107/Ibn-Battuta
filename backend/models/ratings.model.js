import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    touristID: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist" },
    rating: Number,
    comment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
