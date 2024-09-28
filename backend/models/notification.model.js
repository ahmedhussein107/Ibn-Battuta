const mongoose = require("mongoose");
// who has notifications? :  admin, tourist, seller, advertiser
const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId },
    userType: {
      type: String,
      enum: ["admin", "tourist", "seller", "advertiser", "tourguide"],
      required: true,
    },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "warning"], required: true },

    relatedId: { type: mongoose.Schema.Types.ObjectId },
    relatedType: {
      type: String,
      enum: ["complaint", "activity", "event", "product"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default  mongoose.model("Notification", notificationSchema);
