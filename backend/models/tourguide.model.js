import { mongoose } from "mongoose";

const tourGuideSchema = new mongoose.Schema(
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
    mobileNumber: String,
    yearsOfExperience: Number,
    previousWork: String,
    picture: String,
    notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    sumOfRatings: Number,
  },
  { timestamps: true }
);

export default mongoose.model("TourGuide", tourGuideSchema);
