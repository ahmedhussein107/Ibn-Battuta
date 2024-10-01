import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    touristID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist",
      validate: {
        validator: async function (v) {
          const user = await mongoose.model("Tourist").findById(v);
          return user != null;
        },
      },
    },
    rating: Number,
    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
