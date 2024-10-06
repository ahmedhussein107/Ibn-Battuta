import express from "express";
import Admin from "../models/admin.model.js";
import Username from "../models/username.model.js";

const adminRouter = express.Router();

adminRouter.post("/createAdmin", async (req, res) => {
    try {
        const admin = await Admin.create(req.body);
        res.status(201).json(admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

adminRouter.get("/getAdmins", async (req, res) => {
    try {
        const admins = await Admin.find().populate("username");
        res.status(200).json(admins);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

adminRouter.delete("/deleteAdmin/:id", async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const username = await Username.findByIdAndDelete(admin.username._id);
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

adminRouter.put("/updateAdmin/:id", async (req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default adminRouter;
