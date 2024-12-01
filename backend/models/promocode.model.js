import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
	{
		_id: String,
		discount: {
			type: Number,
			default: 20,
			min: 1,
			max: 100,
		},
		maxUsage: {
			type: Number,
			default: 1,
			min: 1,
		},
		usedBy: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tourist" }],
			default: [],
			validate: {
				validator: function (value) {
					return value.length <= this.maxUsage;
				},
				message: "Promo code usage limit exceeded",
			},
		},
		expiresAt: {
			type: Date,
			default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		},
	},
	{ timestamps: true }
);

promoCodeSchema.methods.usePromoCode = async function (touristId) {
	if (this.usedBy.length >= this.maxUsage) {
		throw new Error("Promo code usage limit exceeded");
	}
	if (new Date() > this.expiresAt) {
		throw new Error("Promo code has expired");
	}
	this.usedBy.push(touristId);
	await this.save();
};

export default mongoose.model("PromoCode", promoCodeSchema);
