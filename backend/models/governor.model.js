import mongoose from "mongoose";

const governorSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    landmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Landmark" }],
  },
  { timestamps: true }
);

export default mongoose.model("Governor", governorSchema);
