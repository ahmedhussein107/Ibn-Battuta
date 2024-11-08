import mongoose from "mongoose";
import { validateReference, validateReferences } from "./validatingUtils.js";
const sellerSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			ref: "Username",
			required: true,
		},
		password: { type: String, required: true },
		name: { type: String, required: true },
		email: { type: String, ref: "Email", required: true },
		isAccepted: { type: Boolean, default: false },
		notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
		documents: [String],
		description: { type: String, default: "Enter description" },
		picture: String,
	},
	{ timestamps: true }
);

sellerSchema.pre("save", async function (next) {
	try {
		const { username, email, notifications } = this;

		await validateReference(username, "Username", next);

		if (email) {
			await validateReference(email, "Email", next);
		}

		if (notifications) {
			await validateReferences(notifications, "Notification", next);
		}

		next();
	} catch (error) {
		next(error);
	}
});

const validateUpdateReferences = async function (next) {
	try {
		const update = this.getUpdate();
		const username = update.username || update["$set.username"];
		const email = update.email || update["$set.email"];
		const notifications = update.notifications || update["$set.notifications"];

		if (username) {
			await validateReference(username, "Username", next);
		}

		if (email) {
			await validateReference(email, "Email", next);
		}

		if (notifications) {
			await validateReferences(notifications, "Notification", next);
		}

		next();
	} catch (error) {
		next(error);
	}
};

sellerSchema.pre("findOneAndUpdate", validateUpdateReferences);
sellerSchema.pre("updateOne", validateUpdateReferences);
sellerSchema.pre("findByIdAndUpdate", validateUpdateReferences);
export default mongoose.model("Seller", sellerSchema);
