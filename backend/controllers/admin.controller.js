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
    console.log("inputUsername", inputUsername);
    const username = await Username.findById(inputUsername);
    const email = await Email.findById(inputEmail);
    console.log("email", email);
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

        // hashing password 10 times
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const newAdmin = await Admin.create(req.body);
        res.status(201).json({ message: "Admin created successfully" });
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

// Updating an admin
export const updateAdmin = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
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

export const getUsers = async (req, res) => {
    try {
        console.log("admin params are", req.query);
        let result = [];
        const isAccepted =
            req.query.isAccepted == null || req.query.isAccepted === "true";
        const name = !req.query.name ? "" : req.query.name;
        const currentPage = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const skipCount = (currentPage - 1) * pageSize;

        const query = {};
        query.name = { $regex: name, $options: "i" };

        let totalUserCount = 0;
        let usersFetched = 0;

        for (const [role, model] of Object.entries(models)) {
            query.isAccepted = isAccepted;
            if (role === "tourist" || role === "admin" || role === "governor")
                delete query.isAccepted;

            if (
                !isAccepted &&
                (role === "tourist" || role === "admin" || role === "governor")
            )
                continue;
            const userCount = await model.countDocuments(query);
            totalUserCount += userCount;

            if (result.length >= pageSize) continue;
            const remainingToSkip = Math.max(skipCount - usersFetched, 0);
            const limit = Math.min(pageSize - result.length, pageSize);

            if (limit > 0) {
                const users = await model.find(query).skip(remainingToSkip).limit(limit);
                users.forEach((user) => result.push({ ...user._doc, role }));
            }

            usersFetched += userCount;
        }
        console.log("result", result);

        res.status(200).json({
            result,
            totalPages: Math.ceil(totalUserCount / pageSize),
            currentPage,
            pageSize,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching users" });
    }
};
