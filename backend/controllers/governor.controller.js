import Governor from "../models/governor.model.js";
import Email from "../models/email.model.js";
import Username from "../models/username.model.js";

export const deleteGovernor = async (req, res) => {
    try {
        const governor = await Governor.findByIdAndDelete(req.params.id);

        if (governor) {
            // Delete email associated with the governor
            await Email.findByIdAndDelete(governor.email);

            // Delete username associated with the governor
            await Username.findByIdAndDelete(governor.username);

            res.json({ message: "Governor deleted successfully" });
        } else {
            res.status(404).json({ message: "Governor not found" });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const createGovernor = async (req, res) => {
    const inputUsername = req.body.username;
    const inputEmail = req.body.email;

    const username = await Username.findById(inputUsername);
    const email = await Email.findById(inputEmail);

    if (username) {
        console.log("duplicate username");
        return res
            .status(400)
            .json({ error: "Username already exists. Please choose another one!." });
    }

    if (email) {
        console.log("duplicate email");
        return res
            .status(400)
            .json({ error: "Email already exists!. Please choose another one!" });
    }

    try {
        const newUsername = await Username.create({
            _id: inputUsername,
            userType: "Governor",
        });

        if (inputEmail) {
            await Email.create({
                _id: inputEmail,
            });
        }

        const newGovernor = await Governor.create(req.body);
        res.status(201).json(newGovernor);
        console.log("Governor created successfully");
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};

export const getGovernors = async (req, res) => {
    try {
        const governors = await Governor.find();
        res.json(governors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getGovernorById = async (req, res) => {
    const governorId = req.user.userId;
    try {
        const governor = await Governor.findById(governorId);
        if (governor) {
            res.json(governor);
        } else {
            res.status(404).json({ message: "Governor not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateGovernor = async (req, res) => {
    try {
        const governor = await Governor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (governor) {
            res.json(governor);
        } else {
            res.status(404).json({ message: "Governor not found" });
        }
    } catch (err) {
        res.status(404).json({ message: "Governor not found" });
    }
};
