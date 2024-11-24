import { mongoose } from "mongoose";
import { validateReference, validateReferences } from "./validatingUtils.js";
const touristSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            ref: "Username",
            required: true,
            unique: true, // auto-created index
        },
        password: { type: String, required: true },
        name: { type: String, required: true },
        email: {
            type: String,
            ref: "Email",
            required: true,
            unique: true,
        },
        mobile: { type: String, default: null },
        nationality: { type: String, default: null },
        DOB: { type: Date, required: true, immutable: true },
        job: { type: String, default: null },
        picture: String,
        wallet: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
        loyalityPoints: { type: Number, default: 0 },
        cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        notifications: [{ type: mongoose.Schema.ObjectId, ref: "Notifiction" }],
        hotelBookings: [{ type: Object, default: [] }],
        flightBookings: [{ type: Object, default: [] }],
        preferences: [{ type: String, ref: "Tag" }],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        address: [{ name: String, location: String }],
        currency: { type: String, default: "EGP" },
    },
    { timestamps: true }
);

touristSchema.pre("save", async function (next) {
    try {
        const { username, email, notifications, cart, preferences, wishlist } = this;

        await validateReference(username, "Username", next);

        if (email) {
            await validateReference(email, "Email", next);
        }
        if (notifications) {
            await validateReferences(notifications, "Notification", next);
        }
        if (cart) {
            await validateReferences(cart, "Product", next);
        }
        if (preferences) {
            await validateReferences(preferences, "Tag", next);
        }

        if (wishlist) {
            await validateReferences(wishlist, "Product", next);
        }

        next();
    } catch (error) {
        next(error);
    }
});

const validateUpdateReferences = async function (next) {
    try {
        const update = this.getUpdate();
        const username = update.username || update["$set.username"];
        const email = update.email || update["$set.email"];
        const notifications = update.notifications || update["$set.notifications"];
        const cart = update.cart || update["$set.cart"];
        const preferences = update.preferences || update["$set.preferences"];
        const wishlist = update.wishlist || update["$set.wishlist"];

        if (username) {
            await validateReference(username, "Username", next);
        }

        if (email) {
            await validateReference(email, "Email", next);
        }

        if (notifications) {
            await validateReferences(notifications, "Notification", next);
        }

        if (cart) {
            await validateReferences(cart, "Product", next);
        }
        if (preferences) {
            await validateReferences(preferences, "Tags", next);
        }

        if (wishlist) {
            await validateReferences(wishlist, "Product", next);
        }

        next();
    } catch (error) {
        next(error);
    }
};

touristSchema.pre("findOneAndUpdate", validateUpdateReferences);
touristSchema.pre("updateOne", validateUpdateReferences);
touristSchema.pre("findByIdAndUpdate", validateUpdateReferences);
touristSchema.virtual("age").get(function () {
    const ageInMs = Date.now() - this.DOB.getTime();
    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
    return ageInYears;
});

export default mongoose.model("Tourist", touristSchema);
