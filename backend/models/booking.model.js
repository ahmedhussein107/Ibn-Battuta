import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    touristID: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist" },
    bookingType: {
      type: String,
      enum: ["Itinerary", "Activity"],
      required: true,
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "bookingType",
    },
    totalPrice: { type: Number, required: true },
    count: { type: Number, required: true },
  },
  { timestamps: true }
);

bookingSchema.index({ touristID: 1 });

export default mongoose.model("Booking", bookingSchema);
