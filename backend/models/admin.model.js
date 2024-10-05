import { mongoose, Schema } from "mongoose";

const adminSchema = new Schema(
    {
        username: {
            type: String,
            ref: "Username",
            required: true,
        },
        password: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, ref: "Email" },
        picture: String,
        notifications: [{ type: Schema.ObjectId, ref: "Notifiction" }],
    },
    { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
