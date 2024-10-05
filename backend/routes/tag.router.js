import express from "express";
import Tag from "../models/tag.model.js";

const tagRouter = express.Router();

tagRouter.post("/createTag", async (req, res) => {
    try {
        console.log(req.body);
        const tag = await Tag.create(req.body);
        res.json(tag);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
});

tagRouter.get("/allTag", async (req, res) => {
    try {
        const tag = await Tag.find();
        res.json(tag);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
});

tagRouter.put("/updateTag", async (req, res) => {
    const { tag } = req.body;
    try {
        const tag = await Tag.updateOne({}, { tag });
        res.json(tag);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
});

tagRouter.delete("/deleteTag", async (req, res) => {
    const { tag } = req.body;
    try {
        const tag = await Tag.deleteOne({ tag });
        res.json(tag);
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
});

export default tagRouter;
