import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist" },
    typeType: {
      type: String,
      enum: ["Itinerary", "Activity"],
      required: true,
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "typeType",
    },
    totalPrice: Number,
    count: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
