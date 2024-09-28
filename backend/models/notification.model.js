const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist" },
    actionType: String,
    relatedId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
