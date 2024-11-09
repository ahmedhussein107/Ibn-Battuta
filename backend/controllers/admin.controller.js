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
import bcrypt from "bcrypt";
import { assignCookies } from "./general.controller.js";
// Create a model mapping to access user models dynamically
const models = {
    advertiser: Advertiser,
    seller: Seller,
    tourguide: TourGuide,
    tourist: Tourist,
    governor: Governor,
    admin: Admin,
    advertiser: Advertiser,
    seller: Seller,
    tourguide: TourGuide,
    tourist: Tourist,
    governor: Governor,
    admin: Admin,
};

// Create a controller mapping to access delete functions dynamically
const deleteControllers = {
    advertiser: deleteAdvertiser,
    governor: deleteGovernor,
    seller: deleteSeller,
    tourguide: deleteTourGuide,
    tourist: deleteTourist,
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

        // hashing password 10 times
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const newAdmin = await Admin.create(req.body);
        assignCookies(res, "Admin", newAdmin._id)
            .status(201)
            .json({ message: "Sign up successful" });
        console.log("Admin created successfully");
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
        const newAdmin = await Admin.create(req.body);
        assignCookies(res, "Admin", newAdmin._id)
            .status(201)
            .json({ message: "Sign up successful" });
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
    try {
        const admins = await Admin.find().populate("username");
        res.status(200).json(admins);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAdminById = async (req, res) => {
    const adminId = req.user.userId;
    try {
        const admin = await Admin.findById(adminId);
        if (admin) res.status(200).json(admin);
        else res.status(404).json({ message: "Admin not found" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateAdmin = async (req, res) => {
    const adminId = req.user.userId;
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        if (req.body.email) {
            await Email.findByIdAndDelete(admin.email);
            await Email.create({
                _id: req.body.email,
            });
        }

        // Update admin details
        const updatedAdmin = await Admin.findByIdAndUpdate(adminId, req.body, {
            new: true,
        });

        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Deleting an admin
export const deleteAdmin = async (req, res) => {
    const adminId = req.user.userId;
    try {
        const admin = await Admin.findByIdAndDelete(adminId);
        if (!admin) return res.status(404).json("Admin not found");
        res.status(200).json("Admin deleted successfully!");
    } catch (err) {
        res.status(400).json(err.message);
    }
};

export const getUsers = async (req, res) => {
    try {
        // body is either{isAccepted:true} or {isAccepted:false}
        // tourist and governor don't have is accepted;
        let result = [];
        const isAccepted =
            req.query.isAccepted == null || req.query.isAccepted === "true";
        console.log(req.query);
        const query = !isAccepted ? { isAccepted } : {};
        for (const [key, value] of Object.entries(models)) {
            if (
                !isAccepted &&
                (key === "tourist" || key === "admin" || key === "governor")
            )
                continue;
            console.log("key is ", key, "query is ", query);
            let modelUsers = await value.find(query);
            modelUsers.map((user) => {
                result.push({ ...user._doc, role: key });
            });
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching users" });
    }
    try {
        // body is either{isAccepted:true} or {isAccepted:false}
        // tourist and governor don't have is accepted;
        let result = [];
        const isAccepted =
            req.query.isAccepted == null || req.query.isAccepted === "true";
        console.log(req.query);
        const query = !isAccepted ? { isAccepted } : {};
        for (const [key, value] of Object.entries(models)) {
            if (
                !isAccepted &&
                (key === "tourist" || key === "admin" || key === "governor")
            )
                continue;
            console.log("key is ", key, "query is ", query);
            let modelUsers = await value.find(query);
            modelUsers.map((user) => {
                result.push({ ...user._doc, role: key });
            });
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching users" });
    }
};
