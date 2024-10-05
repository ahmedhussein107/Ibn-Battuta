import mongoose from "mongoose";
import { validateReference } from "./validatingUtils.js";
const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "warning"], required: true },
    isRead: { type: Boolean, default: false },
    relatedType: {
      type: String,
      enum: ["Complaint", "Activity", "Itinerary", "Product"],
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedType",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// a helper function for validation
const validateRelatedTypeAndId = async (relatedType, relatedId, next) => {
  try {
    const validModels = ["Complaint", "Activity", "Itinerary", "Product"];
    if (!validModels.includes(relatedType)) {
      return next(new Error(`Invalid relatedType: ${relatedType}`));
    }
    await validateReference(relatedId, relatedType, next);
  } catch (err) {
    return next(err);
  }
};

// validation for creation
notificationSchema.pre("save", async function (next) {
  try {
    const { relatedType, relatedId } = this;

    if (!relatedType || !relatedId) {
      return next(new Error("Both relatedType and relatedId are required."));
    }
    await validateRelatedTypeAndId(relatedType, relatedId, next);
  } catch (error) {
    next(error);
  }
});

// validation for update
const validateReferencesMiddleware = async function (next) {
  try {
    const update = this.getUpdate();
    const updatedRelatedType = update.relatedType || update["$set.relatedType"];
    const updatedRelatedId = update.relatedId || update["$set.relatedId"];

    if (!updatedRelatedType && !updatedRelatedId) {
      return next();
    }

    const relatedType = updatedRelatedType;
    const relatedId = updatedRelatedId;
    if (relatedType && relatedId)
      await validateRelatedTypeAndId(relatedType, relatedId, next);
    else next();
  } catch (error) {
    next(error);
  }
};

notificationSchema.pre("findOneAndUpdate", validateReferencesMiddleware);
notificationSchema.pre("updateOne", validateReferencesMiddleware);
notificationSchema.pre("findByIdAndUpdate", validateReferencesMiddleware);

export default mongoose.model("Notification", notificationSchema);
