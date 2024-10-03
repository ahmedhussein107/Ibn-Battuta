import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      ref: "Username",
      required: true,
    },
    password: { type: String, required: true },
    email: {
      type: String,
      ref: "Email",
    },
    picture: String, // Optional: URL or path to the picture
    notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
