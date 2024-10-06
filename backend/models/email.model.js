import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({ _id: String }, { timestamps: true });

export default mongoose.model("Email", emailSchema);
