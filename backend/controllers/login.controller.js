import mongoose from "mongoose";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "any key to cipher the password and decipher ";

const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		const userRecord = await mongoose.model("Username").findById({ _id: username });
		if (!userRecord) {
			return res.status(404).json({ message: "Username not found" });
		}

		const user = await mongoose.model(userRecord.userType).findOne({ username });
		if (!user) {
			return res
				.status(404)
				.json({ message: `No user found with the username: ${username}` });
		}
		// skip it until we implement sign up

		// const isPasswordValid = await bcrypt.compare(password, user.password);
		// if (!isPasswordValid) {
		//   return res.status(401).json({ message: "Invalid credentials" });
		// }

		// remove this later
		if (password !== user.password) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ id: user._id, role: user.userType }, secretKey, {
			expiresIn: "5h",
		});

		res.cookie("jwt", token, {
			httpOnly: true,
			maxAge: 3600000,
		});

		res.status(200).json({ message: "Login successful", token });
	} catch (err) {
		console.error("Error during login:", err);
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

export default login;
