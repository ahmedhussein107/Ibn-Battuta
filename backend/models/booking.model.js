import mongoose from "mongoose";
import { validateBookingReferences } from "./validatingUtils.js";

const bookingSchema = mongoose.Schema(
    {
        touristID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tourist",
            required: true,
        },
        bookingType: {
            type: String,
            enum: ["Itinerary", "Activity"],
            required: true,
        },
        typeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "bookingType",
        },
        totalPrice: { type: Number, required: true },
        count: { type: Number, required: true },
    },
    { timestamps: true }
);

bookingSchema.pre("save", async function (next) {
    try {
        const { touristID, typeId, bookingType } = this;
        if (!["Itinerary", "Activity"].includes(bookingType))
            return next(new Error("You must enter a valid Model when saving a booking"));

        await validateBookingReferences(touristID, typeId, bookingType, next);

        next();
    } catch (error) {
        next(error);
    }
});

const validateUpdateReferences = async function (next) {
    try {
        const update = this.getUpdate();
        const touristID = update.touristID || update["$set.touristID"];
        const typeId = update.typeId || update["$set.typeId"];
        const bookingType = update.bookingType || update["$set.bookingType"];

        if (touristID) {
            await validateReference(touristID, "Tourist", next);
        }
        if (bookingSchema && !["Itinerary", "Activity"].includes(bookingType))
            return next(new Error("You must enter a valid Model when saving a booking"));

        if (typeId && bookingType) {
            await validateReference(typeId, bookingType);
        } else if (typeId || bookingType) {
            return next(
                new Error("You can't change only one of bookingType and typeId ")
            );
        }

        next();
    } catch (error) {
        next(error);
    }
};

bookingSchema.pre("findOneAndUpdate", validateUpdateReferences);
bookingSchema.pre("updateOne", validateUpdateReferences);
bookingSchema.pre("findByIdAndUpdate", validateUpdateReferences);

bookingSchema.index({ touristID: 1 });

export default mongoose.model("Booking", bookingSchema);
