import Governor from "../models/governor.model.js";
import Email from "../models/email.model.js";
import Username from "../models/username.model.js";

export const deleteGovernor = async (req, res) => {
    const governorId = req.user.userId;
    try {
        const governor = await Governor.findByIdAndDelete(governorId);

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

export const getGovernor = async (req, res) => {
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
    const governorId = req.user.userId;
    try {
        const governor = await Governor.findById(governorId);
        if (!governor) {
            return res.status(404).json({ message: "governor not found" });
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        if (req.body.email) {
            await Email.findByIdAndDelete(governor.email);
            await Email.create({
                _id: req.body.email,
            });
        }

        // Update governor details
        const updatedgovernor = await Governor.findByIdAndUpdate(governorId, req.body, {
            new: true,
        });

        res.status(200).json(updatedgovernor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const changeGovernorPassword = async (req, res) => {
    const governorId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    try {
        if (!oldPassword || !newPassword) {
            return res.status(400).json("Both old and new passwords are required");
        }
        const governor = await Governor.findById(governorId);
        if (!governor) {
            return res.status(404).json("governor not found");
        }
        const isMatch = await bcrypt.compare(oldPassword, governor.password);
        if (!isMatch) {
            return res.status(400).json("Incorrect old password");
        }
        governor.password = await bcrypt.hash(newPassword, 10);
        await governor.save();
        return res.status(200).json("Password changed successfully!");
    } catch (err) {
        console.error("Error changing password:", err);
        return res.status(400).json("An error occurred while changing the password");
    }
};
