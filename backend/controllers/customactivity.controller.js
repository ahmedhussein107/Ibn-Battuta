import CustomActivity from "../models/customactivity.model.js";

export const createCustomActivity = async (req, res) => {
  try {
    const activity = await CustomActivity.create(req.body);
    res.json(activity);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const getAllCustomActivities = async (req, res) => {
  try {
    const activities = await CustomActivity.find();
    res.json(activities);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const updateCustomActivity = async (req, res) => {
  const customActivityID = req.params.id;
  try {
    const customActivity = await CustomActivity.findByIdAndUpdate(
      customActivityID,
      req.body,
      { new: true }
    );
    res.json(customActivity);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const deleteCustomActivity = async (req, res) => {
  const customActivityID = req.params.id;
  try {
    const customActivity = await CustomActivity.findByIdAndDelete(
      customActivityID
    );
    res.json(customActivity);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};
