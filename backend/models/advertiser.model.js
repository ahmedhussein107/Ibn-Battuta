import { mongoose } from "mongoose";
import { validateReferences, validateReference } from "./validatingUtils.js";
const advertiserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            ref: "Username",
            required: true,
            unique: true,
        },
        password: { type: String, required: true },
        email: { type: String, ref: "Email", required: true },
        name: { type: String, required: true },
        isAccepted: { type: Boolean, default: true },
        document: [String],
        website: String,
        hotline: String,
        companyProfile: String,
        picture: String,
        notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
    },
    { timestamps: true }
);

advertiserSchema.pre("save", async function (next) {
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

advertiserSchema.pre("findOneAndUpdate", validateUpdateReferences);
advertiserSchema.pre("updateOne", validateUpdateReferences);
advertiserSchema.pre("findByIdAndUpdate", validateUpdateReferences);

export default mongoose.model("Advertiser", advertiserSchema);
