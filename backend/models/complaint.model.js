import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    date: Date,
    status: String,
    reply: String,
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
