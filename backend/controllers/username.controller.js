import Username from "../models/username.model.js";

export const createUsername = async (req, res) => {
  try {
    const username = await Username.create(req.body);
    res.json(username);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const getUsernames = async (req, res) => {
  try {
    const usernames = await Username.find();
    res.json(usernames);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const updateUsername = async (req, res) => {
  const { username } = req.body;
  try {
    const usernames = await Username.updateOne({}, { username });
    res.json(usernames);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

export const deleteUsername = async (req, res) => {
  try {
    const username = await Username.findByIdAndDelete(req.params.id);
    res.json(username);
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};
