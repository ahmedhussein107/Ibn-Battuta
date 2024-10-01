import { mongoose } from "mongoose";

const validateReference = (modelName) => {
  return async function (v) {
    const Model = mongoose.model(modelName);  // Dynamically get the model
    const doc = await Model.findById(v);
    return doc != null;  // Return true if the document exists
  };
};

const touristSchema = new mongoose.Schema(
  {
    username: {
      type: mongoose.Schema.Types.ObjectId,
      validate: {
        validator: validateReference("Username"),
      },
      ref: "Username",
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    email: {
      type: mongoose.Schema.Types.ObjectId,
      validate: {
        validator: validateReference("Email"),
      },
      ref: "Email",
      required: true,
      unique: true,
    },
    mobile: String,
    nationality: String,
    DOB: { type: Date, required: true, immutable: true },
    job: String,
    picture: String,
    wallet: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", validate: {validator: validateReference("Product")}}],
    notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction", validate: {validator: validateReference("Notifiction")}}],
    preferences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", validate: {validator: validateReference("Tag")} }],
    savedActivity: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity", validate: {validator: validateReference("Activity")}}],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", validate: {validator: validateReference("Product")}}],
    deliveryAddresses: [
      {
        name: String,
        location: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Tourist", touristSchema);
