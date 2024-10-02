import mongoose from "mongoose";

const usernameSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  userType: {
    type: String,
    enum: ["tourist", "tourguide", "seller", "governor", "advertiser"],
  },
});

export default mongoose.model("Username", usernameSchema);
