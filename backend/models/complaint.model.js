import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist" },
    title: String,
    body: String,
    status: { type: String, enum: ["resolved", "pending"] },
    reply: String,
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
