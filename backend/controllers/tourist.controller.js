import Tourist from "../models/tourist.model.js";
import Username from "../models/username.model.js";
import Email from "../models/email.model.js";

export const getTourist = async (req, res) => {
    try {
        const tourguides = await Tourist.find();
        res.json(tourguides);
    } catch (e) {
        //console.log(e.message);
    }
};

export const createTourist = async (req, res) => {
    //console.log(req.body);
    const inputUsername = req.body.username;
    const inputEmail = req.body.email;
    const username = await Username.findById(inputUsername);
    const email = await Email.findById(inputEmail);
    try {
        if (!username && !email) {
            const newUsername = await Username.create({
                _id: inputUsername,
                userType: "Tourist",
            });
            const newEmail = await Email.create({
                _id: inputEmail,
            });
            const newTourist = await Tourist.create(req.body);
            res.status(201).json(newTourist);
        } else {
            if (username) {
                res.status(400).json({ e: "Username already exists" });
            } else {
                res.status(400).json({ e: "Email already exists" });
            }
        }
    } catch (e) {
        await Username.findByIdAndDelete(inputUsername);
        await Email.findByIdAndDelete(inputEmail);
        res.status(400).json({ e: e.message });
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
        if (tourist) {
            await Username.findByIdAndDelete(tourist.username);
            await Email.findByIdAndDelete(tourist.email);
            res.json(tourist);
        } else {
            res.status(404).json({ e: "Tourist not found" });
        }
    } catch (e) {
        res.status(400).json({ e: e.message });
    }
};
