import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
    {
        touristID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tourist",
            required: true,
        },
        title: String,
        body: { type: String, required: true },
        status: { type: String, enum: ["resolved", "pending"], default: "pending" },
        reply: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    },
    { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
