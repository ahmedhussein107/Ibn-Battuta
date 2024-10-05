import mongoose from "mongoose";

const touristActivityNotificationSchema = new mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist",
      required: true,
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
  },
  { timestamps: true }
);

touristActivityNotificationSchema.index({ touristId: 1 });
touristActivityNotificationSchema.index({ activityId: 1 });

export default mongoose.model(
  "TouristActivityNotification",
  touristActivityNotificationSchema
);
