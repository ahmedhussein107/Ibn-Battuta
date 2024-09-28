import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAccepted: { type: Boolean, default: false },
    document: String,
    name: String,
    description: String,
    picture: String,
    // notifications: [{ message: String, date: Date }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
