import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: { type: Number, required: true },
    count: { type: Number, required: true },

    address: String,
    method: { type: String, enum: ["card", "wallet", "cash on delivery"] },
    status: { type: String, enum: ["delivered", "canceled", "pending"] },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
