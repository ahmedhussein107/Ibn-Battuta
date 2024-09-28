import { mongoose } from "mongoose";

const AdvertiserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isAccepted: { type: Boolean, default: false },
  document: String,
  website: String,
  hotline: String,
  companyProfile: String,
  picture: String,
  notifications: [{ message: String, date: Date }],
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
});

export default mongoose.model("Advertiser", AdvertiserSchema);
