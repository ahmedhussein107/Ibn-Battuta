import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
  {
    percentage: Number,
    token: String,
    expiryDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PromoCode", promoCodeSchema);
