import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    complaintID: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
    body: String,
    authorType: { type: String, enum: ["Tourist", "Admin"], required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "authorType",
      required: true,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
