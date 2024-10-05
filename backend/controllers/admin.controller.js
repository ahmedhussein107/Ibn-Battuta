import Admin from "../models/admin.model.js";
import Username from "../models/username.model.js";
import Advertiser from "../models/advertiser.model.js";
import Governor from "../models/governor.model.js";
import Seller from "../models/seller.model.js";
import TourGuide from "../models/tourguide.model.js";
import Tourist from "../models/tourist.model.js";

// Import deletion controller functions
import { deleteAdvertiser } from "../controllers/advertiser.controller.js";
import { deleteGovernor } from "../controllers/governor.controller.js";
import { deleteSeller } from "../controllers/seller.controller.js";
import { deleteTourGuide } from "../controllers/tourguide.controller.js";
import { deleteTourist } from "../controllers/tourist.controller.js";
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
