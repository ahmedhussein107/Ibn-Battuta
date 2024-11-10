import mongoose from "mongoose";
import { Schema } from "mongoose";
import { validateReference, validateReferences } from "./validatingUtils.js";

const adminSchema = new Schema(
    {
        username: {
            type: String,
            ref: "Username",
            required: true,
            unique: true,
        },
        password: { type: String, required: true },
        name: { type: String },
        email: { type: String, ref: "Email" },
        picture: String,
        notifications: [{ type: Schema.ObjectId, ref: "Notifiction" }],
    },
    { timestamps: true }
);

adminSchema.pre("save", async function (next) {
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

adminSchema.pre("findOneAndUpdate", validateUpdateReferences);
adminSchema.pre("updateOne", validateUpdateReferences);
adminSchema.pre("findByIdAndUpdate", validateUpdateReferences);

export default mongoose.model("Admin", adminSchema);
