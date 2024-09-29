import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    pictures: [String],
    name: String,
    price: Number,
    description: String,
    ownerType: { type: String, required: true, enum: ["Admin", "Seller"] },
    ownerID: { type: mongoose.Schema.Types.ObjectId, refPath: "ownerType" },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    sumOfRatings: Number,
    quantity: Number,
    numberOfSales: Number,
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
