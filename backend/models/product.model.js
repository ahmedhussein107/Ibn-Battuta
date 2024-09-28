import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    picture: String,
    name: String,
    price: Number,
    description: String,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    quantity: Number,
    numberOfSales: Number,
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
