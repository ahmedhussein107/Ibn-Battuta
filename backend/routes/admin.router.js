import express from "express";
import Admin from "../models/admin.model.js";

import {
    getAdmins,
    createAdmin,
    deleteAdmin,
    deleteUser,
    updateAdmin,
    getUsers,
    getAdminById,
} from "../controllers/admin.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";
const adminRouter = express.Router();

adminRouter.post("/createAdmin", createAdmin);

adminRouter.get("/getAdmins", getAdmins);

adminRouter.get("/getUsers", getUsers);

adminRouter.delete("/deleteAdmin", isAuthenticated, deleteAdmin);

adminRouter.put("/updateAdmin", isAuthenticated, updateAdmin);

adminRouter.get("/getAdminById", isAuthenticated, getAdminById);

// New route for deleting a user based on userType and ID
adminRouter.delete("/deleteUser/:userType/:id", deleteUser);
export default adminRouter;
