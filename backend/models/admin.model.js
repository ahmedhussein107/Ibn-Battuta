import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
    picture: String, // Optional: URL or path to the picture
    notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
