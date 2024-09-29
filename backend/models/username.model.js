import mongoose from "mongoose";

const usernameSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model("Username", usernameSchema);
