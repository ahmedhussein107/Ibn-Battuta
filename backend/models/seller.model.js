import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      ref: "Username",
      required: true,
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: {
      type: String,
      ref: "Email",
      required: true,
    },
    isAccepted: { type: Boolean, default: false },
    notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
    document: [String],
    name: String,
    description: String,
    picture: String,
  },
  { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);
