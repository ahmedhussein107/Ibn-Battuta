import express from "express";
import Governor from "../models/governor.model.js";
import e from "express";
const governorRouter = express.Router();

governorRouter.post("/createGovernor", async (req, res) => {
    try {
        const newGovernor = await Governor.create(req.body);
        res.json(newGovernor);
        res.status(201).json({ message: "Governor created successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("not created");
    }
});

governorRouter.get("/getGovernors", async (req, res) => {
    try {
        const governors = await Governor.find();
        res.json(governors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

governorRouter.get("/getGovernor/:id", async (req, res) => {
    try {
        const governor = await Governor.findById(req.params.id);
        if (governor) {
            res.json(governor);
        } else {
            res.status(404).json({ message: "Governor not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

governorRouter.delete("/deleteGovernor/:id", async (req, res) => {
    try {
        const governor = await Governor.findByIdAndDelete(req.params.id);
        if (governor) {
            res.json({ message: "Governor deleted successfully" });
        } else {
            res.status(404).json({ message: "Governor not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default governorRouter;
