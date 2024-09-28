import mongoose from "mongoose";

const landmarkSchema = new mongoose.Schema(
  {
    description: String,
    pictures: [String],
    location: String,
    ticketPrices: [Number],
    openingHours: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        open: { type: String, default: "09:00" }, // e.g., "09:00"
        close: { type: String, default: "21:00" }, // e.g., "18:00"
      },
    ],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  },
  { timestamps: true }
);

export default mongoose.model("Landmark", landmarkSchema);
