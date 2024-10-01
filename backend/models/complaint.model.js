import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    touristID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist",
      required: true,
    },
    title: String,
    body: String,
    status: { type: String, enum: ["resolved", "pending"] },
    reply: String,
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
