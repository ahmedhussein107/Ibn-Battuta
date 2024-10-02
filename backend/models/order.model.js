import mongoose from "mongoose";

const validateReference = (modelName) => {
  return async function (v) {
    const Model = mongoose.model(modelName);  // Dynamically get the model
    const doc = await Model.findById(v);
    return doc != null;  // Return true if the document exists
  };
};

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist", required: true, validate: {validator: validateReference("Tourist")}},
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, validate: {validator: validateReference("Product")}},
    price: Number,
    count: Number,
    address: String,
    method: { type: String, enum: ["card", "wallet", "cash on delivery"] },
    status: { type: String, enum: ["delivered", "canceled", "pending"] },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
