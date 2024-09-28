import { mongoose } from "mongoose";


const TourGuideSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isAccepted: { type: Boolean, default: false },
  document: String,
  mobileNumber: String,
  yearsOfExperience: Number,
  previousWork: String,
  picture: String,
  // notifications: [{ message: String, date: Date }],
  itineraries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Itinerary" }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
  sumofRatings: Number,
});

export default mongoose.model("TourGuide", TourGuideSchema);
