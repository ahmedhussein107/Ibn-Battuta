import mongoose from "mongoose";

const usernameSchema = new mongoose.Schema({
  _id: String,
  userType: {
    type: String,
    enum: ["tourist", "tourguide", "seller", "governor", "advertiser"],
  },
});

export default mongoose.model("Username", usernameSchema);
