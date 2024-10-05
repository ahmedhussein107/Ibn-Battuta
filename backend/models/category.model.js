import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({ _id: String }, { timestamps: true });

export default mongoose.model("Category", categorySchema);
