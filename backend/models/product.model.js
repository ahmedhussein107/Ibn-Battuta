import mongoose from "mongoose";

const validateReference = (modelName) => {
  return async function (v) {
    const Model = mongoose.model(modelName);  // Dynamically get the model
    const doc = await Model.findById(v);
    return doc != null;  // Return true if the document exists
  };
};

const productSchema = new mongoose.Schema(
  {
    pictures: [String],
    name: String,
    price: Number,
    description: String,
    ownerType: { type: String, required: true, enum: ["Admin", "Seller"] },
    ownerID: { type: mongoose.Schema.Types.ObjectId, refPath: "ownerType", validate: {validator: validateReference("Admin") || validateReference("Seller") }},
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating", validate: {validator: validateReference("Rating")}}],
    sumOfRatings: Number,
    quantity: Number,
    numberOfSales: Number,
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
