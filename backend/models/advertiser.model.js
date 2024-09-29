import { mongoose } from "mongoose";

const advertiserSchema = new mongoose.Schema(
  {
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Username",
      required: true,
    },
    password: { type: String, required: true },
    email: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Email",
      required: true,
    },
    isAccepted: { type: Boolean, default: false },
    document: String,
    website: String,
    hotline: String,
    companyProfile: String,
    picture: String,
    notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
  },
  { timestamps: true }
);

export default mongoose.model("Advertiser", advertiserSchema);
