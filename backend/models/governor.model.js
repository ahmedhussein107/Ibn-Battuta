import mongoose from "mongoose";

const governorSchema = new mongoose.Schema(
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
    },
  },
  { timestamps: true }
);

export default mongoose.model("Governor", governorSchema);
