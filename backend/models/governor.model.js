import mongoose from "mongoose";

const governorSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            ref: "Username",
            required: true,
        },
        password: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, ref: "Email" },
    },
    { timestamps: true }
);

const Governor = mongoose.model("Governor", governorSchema);

export default Governor;
