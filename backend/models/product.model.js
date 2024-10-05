import mongoose from "mongoose";
import { validateReference, validateReferences } from "./validatingUtils.js";

const productSchema = new mongoose.Schema(
  {
    pictures: [String],
    name: String,
    price: Number,
    description: String,
    ownerType: { type: String, required: true, enum: ["Admin", "Seller"] },
    ownerID: { type: mongoose.Schema.Types.ObjectId, refPath: "ownerType" },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    sumOfRatings: { type: Number, default: 0 },
    quantity: { type: Number, min: 1 },
    numberOfSales: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const validateOwnerTypeAndId = async (ownerType, ownerID, next) => {
  try {
    const validModels = ["Admin", "Seller"];
    if (!validModels.includes(ownerType)) {
      return next(new Error(`Invalid ownerType: ${ownerType}`));
    }
    await validateReference(ownerID, ownerType, next);
  } catch (err) {
    return next(err);
  }
};

productSchema.pre("save", async function (next) {
  try {
    const { ownerType, ownerID, ratings } = this;

    if (!ownerType || !ownerID) {
      return next(new Error("Both ownerType and ownerID are required."));
    }
    await validateOwnerTypeAndId(ownerType, ownerID, next);
    if (ratings && ratings.length > 0)
      await validateReferences(ratings, "Rating", next);
  } catch (error) {
    next(error);
  }
});

const validateRatings = async function (next) {
  try {
    const update = this.getUpdate();
    const ratings = update.ratings || update["$set.ratings"];
    const updatedOwnerType = update.ownerType || update["$set.ownerType"];
    const updatedOwnerID = update.ownerID || update["$set.ownerID"];

    if (ratings) {
      await validateReferences(ratings, "Rating", next);
    }
    if (updatedOwnerID && updatedOwnerType) {
      await validateReference(updatedOwnerID, updatedOwnerType, next);
    } else if (updatedOwnerID && updatedOwnerType)
      return next(
        new Error("You can't change only one of ownerId and ownerType ")
      );
    next();
  } catch (error) {
    next(error);
  }
};

productSchema.pre("findOneAndUpdate", validateRatings);
productSchema.pre("updateOne", validateRatings);
productSchema.pre("findByIdAndUpdate", validateRatings);


productSchema.index({ ownerID: 1 });

export default mongoose.model("Product", productSchema);
