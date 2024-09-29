const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "warning"], required: true },
    isRead: { type: Boolean, default: false },
    relatedType: {
      type: String,
      enum: ["complaint", "activity", "event", "product"],
      required: true,
    },
    relatedId: { type: mongoose.Schema.Types.ObjectId, refPath: "relatedType" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", notificationSchema);
