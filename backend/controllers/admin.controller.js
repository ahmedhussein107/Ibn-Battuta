import Admin from "../models/admin.model.js";
import Username from "../models/username.model.js";
import Advertiser from "../models/advertiser.model.js";
import Governor from "../models/governor.model.js";
import Seller from "../models/seller.model.js";
import TourGuide from "../models/tourguide.model.js";
import Tourist from "../models/tourist.model.js";
import Email from "../models/email.model.js";

// Import deletion controller functions
import { deleteAdvertiser } from "../controllers/advertiser.controller.js";
import { deleteGovernor } from "../controllers/governor.controller.js";
import { deleteSeller } from "../controllers/seller.controller.js";
import { deleteTourGuide } from "../controllers/tourguide.controller.js";
import { deleteTourist } from "../controllers/tourist.controller.js";
import mongoose, { set } from "mongoose";
// Create a model mapping to access user models dynamically
const models = {
  advertiser: Advertiser,
  governor: Governor,
  seller: Seller,
  tourguide: TourGuide,
  tourist: Tourist,
};

// Create a controller mapping to access delete functions dynamically
const deleteControllers = {
  advertiser: deleteAdvertiser,
  governor: deleteGovernor,
  seller: deleteSeller,
  tourguide: deleteTourGuide,
  tourist: deleteTourist,
};

/**
 * Deletes a user from the system based on user type and ID
 */
export const deleteUser = async (req, res) => {
  const { userType } = req.params;

  try {
    // Validate user type and controller
    const deleteController = deleteControllers[userType.toLowerCase()];
    if (!deleteController) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Call the appropriate controller function, passing `req` and `res`
    await deleteController(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
// Additional Admin Operations
// Example for creating an admin
export const createAdmin = async (req, res) => {
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
      userType: "Admin",
    });
    if (inputEmail) {
      const newEmail = await Email.create({
        _id: inputEmail,
      });
    }

    const newAdmin = await Admin.create(req.body);
    res.status(201).json(newAdmin);
    console.log("Admin created successfully");
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Getting all admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().populate("username");
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const acceptUserByModel = async (req, res) => {
  try {
    const { userType, userId } = req.body;
    if (!userType || !userId) {
      return res.status(400).json({ message: "Invalid user type or ID" });
    }
    const UserModel = mongoose.model(userType);
    if (!UserModel) {
      return res.status(400).json({ message: "Invalid user type" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isAccepted = true;
    await user.save();
    res.status(200).json({ message: "User accepted successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Updating an admin
export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deleting an admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json("Admin not found");
    res.status(200).json("Admin deleted successfully!");
  } catch (err) {
    res.status(400).json(err.message);
  }
};
