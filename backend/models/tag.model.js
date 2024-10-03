import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({ _id: String }, { timestamps: true });

export default mongoose.model("Tag", tagSchema);
