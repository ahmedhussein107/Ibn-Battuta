import { mongoose } from "mongoose";

const TouristSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, immutable: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: String,
    nationality: String,
    DOB: { type: Date, required: true, immutable: true },
    job: String,
    picture: String,
    wallet: Number,
    points: { type: Number, default: 0 },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    // notifications: [{ message: String, date: Date }],
    preferences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    bookedActivities: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
    ],
    bookedItineraries: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Itinerary" },
    ],
    savedActivity: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    deliveryAddresses: [String], // link or coordinates
  },
  { timestamps: true }
);

export default mongoose.model("Tourist", TouristSchema);
