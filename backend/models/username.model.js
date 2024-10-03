import mongoose from "mongoose";

const usernameSchema = new mongoose.Schema({
  _id: String,
});

export default mongoose.model("Username", usernameSchema);
