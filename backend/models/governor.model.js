import mongoose from "mongoose";
import emailModel from "./email.model.js"; // Ensure the correct extension
import usernameModel from "./username.model.js";

const governorSchema = new mongoose.Schema(
  {
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Username",
      required: true,
      validate: {
        validator: async function(value) {
          // Check if the username exists in the Username collection
          const userExists = await usernameModel.countDocuments({ _id: value });
          if (!userExists) {
            return false; // Username does not exist
          }

          // Check for duplicates in the Governor collection
          const duplicateCount = await this.constructor.countDocuments({ username: value });
          return duplicateCount === 0; // Return true if no duplicates exist
        },
      }
    },
    password: { type: String, required: true },
    email: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Email",
      required: true,
      validate: {
        validator: async function(value) {
          // Check if the email exists in the Email collection
          const emailExists = await emailModel.countDocuments({ _id: value });
          if (!emailExists) {
            return false; // Email does not exist
          }

          // Check for duplicates in the Governor collection
          const duplicateCount = await this.constructor.countDocuments({ email: value });
          return duplicateCount === 0; // Return true if no duplicates exist
        },
      }
    },
  },
  { timestamps: true }
);

const Governor = mongoose.model("Governor", governorSchema);

export default Governor;
