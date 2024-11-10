import mongoose from "mongoose";
import { validateReference } from "./validatingUtils.js";

const orderSchema = new mongoose.Schema(
	{
		buyer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tourist",
			required: true,
		},
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		price: { type: Number, required: true },
		count: { type: Number, required: true },
		address: String,
		method: {
			type: String,
			enum: ["card", "wallet", "cash on delivery"],
			default: "cash on delivery",
		},
		status: { type: String, enum: ["delivered", "canceled", "pending"], default: "delivered" },
		ratingID: { type: mongoose.Schema.Types.ObjectId, ref: "Rating" },
	},
	{ timestamps: true }
);

orderSchema.pre("save", async function (next) {
	try {
		const { buyer, product } = this;

		await validateReference(buyer, "Tourist", next);
		await validateReference(product, "Product", next);

		next();
	} catch (error) {
		next(error);
	}
});

orderSchema.pre("findOneAndUpdate", async function (next) {
	try {
		const update = this.getUpdate();
		const updatedBuyer = update.buyer || update["$set.buyer"];
		const updatedProduct = update.product || update["$set.product"];

		if (updatedBuyer) {
			await validateReference(updatedBuyer, "Tourist", next);
		}
		if (updatedProduct) {
			await validateReference(updatedProduct, "Product", next);
		}

		next();
	} catch (error) {
		next(error);
	}
});

export default mongoose.model("Order", orderSchema);
