import { mongoose } from "mongoose";

const touristSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      ref: "Username",
      required: true,
      unique: true, // auto-created index
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: {
      type: String,
      ref: "Email",
      required: true,
      unique: true,
    },
    mobile: String,
    nationality: String,
    DOB: { type: Date, required: true, immutable: true },
    job: String,
    picture: String,
    wallet: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
    preferences: [{ type: String, ref: "Tag" }],
    savedActivity: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    deliveryAddresses: [
      {
        name: String,
        location: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Tourist", touristSchema);
