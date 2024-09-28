import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist" },
    item: {
      itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
      itemType: { type: String, enum: ["Product", "Activity"], required: true },
    },
    price: Number,
    count: Number,
    address: String,
    method: { type: String, enum: ["card", "wallet"] },
    status: { type: String, enum: ["delivered", "canceled", "pending"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
