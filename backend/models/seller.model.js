import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Username",
      required: true,
    },
    password: { type: String, required: true },
    email: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Email",
      required: true,
    },
    isAccepted: { type: Boolean, default: false },
    notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
    document: String,
    name: String,
    description: String,
    picture: String,
  },
  { timestamps: true }
);

export default mongoose.model("Seller", sellerSchema);
