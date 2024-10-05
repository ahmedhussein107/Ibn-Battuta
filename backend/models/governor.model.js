import mongoose from "mongoose";
import { validateReference } from "./validatingUtils.js";

const governorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      ref: "Username",
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: {
      type: String,
      ref: "Email",
    },
  },
  { timestamps: true }
);

governorSchema.pre("save", async function (next) {
  try {
    const { username, email } = this;
    await validateReference(username, "Username", next);
    if (email) {
      await validateReference(email, "Email", next);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const validateReferencesMiddleware = async function (next) {
  try {
    const update = this.getUpdate();
    const updatedUsername = update.username || update["$set.username"];
    const updatedEmail = update.email || update["$set.email"];

    if (updatedUsername) {
      await validateReference(updatedUsername, "Username", next);
    }
    if (updatedEmail) {
      await validateReference(updatedEmail, "Email", next);
    }
    next();
  } catch (error) {
    next(error);
  }
};

governorSchema.pre("findOneAndUpdate", validateReferencesMiddleware);
governorSchema.pre("updateOne", validateReferencesMiddleware);
governorSchema.pre("findByIdAndUpdate", validateReferencesMiddleware);

const Governor = mongoose.model("Governor", governorSchema);

export default Governor;
