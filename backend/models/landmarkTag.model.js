import mongoose from "mongoose";

const landmarkTagSchema = new mongoose.Schema({ _id: String }, { timestamps: true });

export default mongoose.model("LandmarkTag", landmarkTagSchema);
