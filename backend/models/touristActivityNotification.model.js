import mongoose from "mongoose";

const touristActivityNotificationSchema = new mongoose.Schema(
    {
        touristID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tourist",
            required: true,
        },
        activityID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Activity",
            required: true,
        },
    },
    { timestamps: true }
);

touristActivityNotificationSchema.index({ touristID: 1 });
touristActivityNotificationSchema.index({ activityID: 1 });

export default mongoose.model(
    "TouristActivityNotification",
    touristActivityNotificationSchema
);
