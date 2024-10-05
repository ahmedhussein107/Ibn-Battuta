import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        message: { type: String, required: true },
        type: { type: String, enum: ["info", "warning"], required: true },
        isRead: { type: Boolean, default: false },
        relatedType: {
            type: String,
            enum: ["Complaint", "Activity", "Itinerary", "Product"],
            required: true,
        },
        relatedId: { type: mongoose.Schema.Types.ObjectId, refPath: "relatedType" },
    },
    {
        timestamps: true,
    }
);

// Middleware to validate the referenced collections
notificationSchema.pre("save", async function (next) {
    try {
        const relatedType = this.relatedType;
        const relatedId = this.relatedId;

        // Check if relatedType and relatedId are defined
        if (!relatedType || !relatedId) {
            return next(); // If not defined, skip validation
        }

        // Use a switch-case to handle validation for each type
        let exists = false;
        switch (relatedType) {
            case "Complaint":
                exists = await mongoose.model("Complaint").findById(relatedId);
                break;
            case "Activity":
                exists = await mongoose.model("Activity").findById(relatedId);
                break;
            case "Event":
                exists = await mongoose.model("Event").findById(relatedId);
                break;
            case "Product":
                exists = await mongoose.model("Product").findById(relatedId);
                break;
            default:
                return next(new Error(`Invalid relatedType: ${relatedType}`));
        }

        if (!exists) {
            return next(new Error(`${relatedType} with ID ${relatedId} does not exist.`));
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Middleware for updates to validate referenced collections
const validateReferencesMiddleware = async function (next) {
    try {
        const update = this.getUpdate();
        const query = this.getQuery();

        // Extract relatedId and relatedType from the update query if they are being modified
        const updatedRelatedType = update.relatedType;
        const updatedRelatedId = update.relatedId;

        // Get the current document state to identify any changes
        const currentDoc = await this.model.findOne(query).select("relatedType relatedId");

        // Determine the actual relatedType and relatedId to validate
        const relatedType = updatedRelatedType || (currentDoc ? currentDoc.relatedType : null);
        const relatedId = updatedRelatedId || (currentDoc ? currentDoc.relatedId : null);

        // Check if we have a valid relatedType and relatedId to validate
        if (!relatedType || !relatedId) {
            return next(); // Skip validation if we don't have both fields
        }

        // Use a switch-case to handle validation for each type
        let exists = false;
        switch (relatedType) {
            case "Complaint":
                exists = await mongoose.model("Complaint").exists({ _id: relatedId });
                break;
            case "Activity":
                exists = await mongoose.model("Activity").exists({ _id: relatedId });
                break;
            case "Event":
                exists = await mongoose.model("Event").exists({ _id: relatedId });
                break;
            case "Product":
                exists = await mongoose.model("Product").exists({ _id: relatedId });
                break;
            default:
                return next(new Error(`Invalid relatedType: ${relatedType}`));
        }

        // If the document does not exist, throw an error
        if (!exists) {
            return next(new Error(`${relatedType} with ID ${relatedId} does not exist.`));
        }

        // Proceed with the update
        next();
    } catch (error) {
        next(error);
    }
};

notificationSchema.pre("findOneAndUpdate", validateReferencesMiddleware);
notificationSchema.pre("updateOne", validateReferencesMiddleware);
notificationSchema.pre("updateMany", validateReferencesMiddleware);
notificationSchema.pre("findByIdAndUpdate", validateReferencesMiddleware);

export default mongoose.model("Notification", notificationSchema);
