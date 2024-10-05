import mongoose from "mongoose";

const landmarkSchema = new mongoose.Schema(
  {
    governorID: { type: mongoose.Schema.Types.ObjectId, ref: "Governor" },
    name: String,
    description: String,
    pictures: [String],
    location: String,
    ticketPrices: { type: Map, of: Number },
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
        open: Date,
        close: Date, // hours and minutes only
      },
    ],
    tags: [{ type: String, ref: "Tag" }],
  },
  { timestamps: true }
);

landmarkSchema.index({ location: 1 });

export default mongoose.model("Landmark", landmarkSchema);
