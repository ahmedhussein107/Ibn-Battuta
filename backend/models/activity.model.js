import mongoose from "mongoose";
import { Schema } from "mongoose";
import { validateAdvertiserAndCategory, validateReferences } from "./validatingUtils.js";

const activitySchema = new Schema(

	{
		name: String,
		description: String,
		advertiserID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Advertiser",
			required: true,
		},
		location: { type: String, required: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		price: Number,
		category: { type: String, ref: "Category" },
		tags: [{ type: String, ref: "Tag" }],
		ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
		isOpenForBooking: { type: Boolean, default: true },
		isFlagged: { type: Boolean, default: false },
		sumOfRatings: { type: Number, default: 0 },
		freeSpots: { type: Number, required: true },
		specialDiscount: { type: Number, default: 0 },
	},
	{
		timestamps: true,

		toJSON: { virtuals: true }, // Ensure virtuals are included when converting to JSON
		toObject: { virtuals: true }, // Ensure virtuals are included when converting to plain objects
	}

);

activitySchema.pre("save", async function (next) {
	try {
		const { advertiserID, category, tags, ratings } = this;

		await validateAdvertiserAndCategory(advertiserID, category, next);

		if (tags) await validateReferences(tags, "Tag", next);
		if (ratings) await validateReferences(ratings, "Rating", next);

		if (this.startDate && this.endDate && this.startDate > this.endDate) {
			return next(new Error("End date must be after start date."));
		}

		next();
	} catch (error) {
		next(error);
	}
});

const validateUpdateDates = function (next) {
	const update = this.getUpdate();
	const { startDate, endDate } = update;

	if (startDate && endDate && startDate > endDate) {
		return next(new Error("End date must be after start date."));
	}

	next();
};

const validateReferencesMiddleware = async function (next) {
	try {
		const update = this.getUpdate();
		const advertiserID = update.advertiserID || update["$set.advertiserID"];
		const categoryID = update.category || update["$set.category"];
		const tags = update.tags || update["$set.tags"];
		const ratings = update.ratings || update["$set.ratings"];

		if (advertiserID) {
			await validateAdvertiserAndCategory(advertiserID, categoryID, next);
		}

		if (tags) await validateReferences(tags, "Tag", next);
		if (ratings) await validateReferences(ratings, "Rating", next);

		validateUpdateDates.call(this, next);
	} catch (error) {
		next(error);
	}
};

activitySchema.pre("findOneAndUpdate", validateReferencesMiddleware);
activitySchema.pre("updateOne", validateReferencesMiddleware);
activitySchema.pre("findByIdAndUpdate", validateReferencesMiddleware);

activitySchema.virtual("rating").get(function () {
	// Ensure ratings is not empty to avoid division by zero
	if (this.ratings && this.ratings.length > 0) {
		return this.sumOfRatings / this.ratings.length;
	}
	return -1; // Return -1 if there are no ratings and handle in frontend
});

export default mongoose.model("Activity", activitySchema);
