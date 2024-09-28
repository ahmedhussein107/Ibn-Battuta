import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
  {
    percentage: Number,
    token: String,
    expiryDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("PromoCode", promoCodeSchema);
