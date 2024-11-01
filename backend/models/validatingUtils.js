import mongoose from "mongoose";

export const validateReference = async (ref, modelName, next) => {
    const exists = await mongoose.model(modelName).exists({ _id: ref });
    if (!exists) {
        return next(new Error(`${modelName} with ID ${ref} does not exist.`));
    }
};

export const validateReferences = async (refs, modelName, next) => {
    for (const ref of refs) {
        await validateReference(ref, modelName, next);
    }
};

export const validateAdvertiserAndCategory = async (advertiserID, categoryID, next) => {
    await validateReference(advertiserID, "Advertiser", next);

    if (categoryID) {
        await validateReference(categoryID, "Category", next);
    }
};

export const validateBookingReferences = async (touristID, typeId, bookingType, next) => {
    await validateReference(touristID, "Tourist", next);

    await validateReference(typeId, bookingType, next);
};
