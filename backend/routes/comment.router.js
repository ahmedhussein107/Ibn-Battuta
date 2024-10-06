import express from "express";
import Comment from "../models/comment.model.js";

const commentRouter = express.Router();

commentRouter.post("/createcomment", async (req, res) => {
  const comment = req.body;
  const newcomment = new Comment(comment);
  try {
    await newcomment.save();
    res.status(201).json(newcomment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

commentRouter.get("/getcomments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

commentRouter.get("/getcomment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({ message: "comment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

commentRouter.put("/updatecomment/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const comment = await Comment.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({ message: "comment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

commentRouter.delete("/deletecomment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (comment) {
      res.status(200).json({ message: "comment deleted successfully" });
    } else {
      res.status(404).json({ message: "comment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default commentRouter;
