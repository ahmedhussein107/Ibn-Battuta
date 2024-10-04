import Tourist from "../models/tourist.model.js";
import { createUsername } from "../controllers/username.controller.js";

export const getTourist = async (req, res) => {
  try {
    const tourguides = await Tourist.find();
    res.json(tourguides);
  } catch (e) {
    console.log(e.message);
  }
};

export const createTourist = async (req, res) => {
  try {
    console.log(req.body);
    const { username } = req.body;
    const newReq = { ...req.body, _id: username, userType: "Tourist" };
    const newRes = { ...res };
    await createUsername(newReq, newRes);
    if (newRes.status !== 201) {
      res.status(400).json(`username: ${username} already exists`);
      return;
    }
    const tourist = await Tourist.create(req.body);
    res.json(tourist);
  } catch (e) {
    console.log(e.message);
  }
};

export const updateTourist = async (req, res) => {
  try {
    const tourist = await Tourist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(tourist);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const deleteTourist = async (req, res) => {
  try {
    const tourist = await Tourist.findByIdAndDelete(req.params.id);
    res.json(tourist);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};
