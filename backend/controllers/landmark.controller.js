import Landmark from "../models/landmark.model.js";


// view all landmarks
export const getLandmarks = async (req, res) => {
  try {
    const landmarks = await Landmark.find();
    res.json(landmarks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};