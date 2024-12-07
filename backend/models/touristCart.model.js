import mongoose from "mongoose";

const touristCartSchema = new mongoose.Schema(
    {
        touristID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tourist",
            required: true,
        },
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        count: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    { timestamps: true }
);

touristCartSchema.index({ touristID: 1 });
touristCartSchema.index({ productID: 1 });

export default mongoose.model("TouristCart", touristCartSchema);
