import mongoose from "mongoose";

const touristWishlistSchema = new mongoose.Schema(
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
    },
    { timestamps: true }
);

touristWishlistSchema.index({ touristID: 1 });
touristWishlistSchema.index({ productID: 1 });

export default mongoose.model("TouristWishlist", touristWishlistSchema);
