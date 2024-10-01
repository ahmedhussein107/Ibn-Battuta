import express from "express";
import Username from "../models/username.model.js";

const router = express.Router();

router.post("/createUsername", async (req, res) => {
  try {
    const username = await Username.create(req.body);
    res.status(201).json(username);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/getUsername", async (req, res) => {
  try {
    const username = await Username.find({});
    if (username) {
      res.json(username);
    } else {
      res.status(404).json({ message: "Username not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
