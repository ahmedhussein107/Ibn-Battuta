import Admin from "../models/admin.model.js";
import Username from "../models/username.model.js";
import Advertiser from "../models/advertiser.model.js";
import Governor from "../models/governor.model.js";
import Seller from "../models/seller.model.js";
import Tourguide from "../models/tourguide.model.js";
import Tourist from "../models/tourist.model.js";

// Create a model mapping to access user models dynamically
const models = {
  advertiser: Advertiser,
  governor: Governor,
  seller: Seller,
  tourGuide: TourGuide,
  tourist: Tourist,
};

/**
 * Deletes a user from the system based on user type and ID
 */
export const deleteUser = async (req, res) => {
  const { userType, id } = req.params;
  try {
    // Check if the userType is valid
    const Model = models[userType.toLowerCase()];
    if (!Model) return res.status(400).json({ message: "Invalid user type" });

    // Attempt to delete the user
    const user = await Model.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: `${userType} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Additional Admin Operations
// Example for creating an admin
export const createAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Getting all admins
export const allAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().populate("username");
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

