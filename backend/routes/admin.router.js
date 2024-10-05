import express from "express";
import Admin from "../models/admin.model.js";

import {
  allAdmins,
  createAdmin,
  deleteAdmin,
  deleteUser,
  updateAdmin,
} from "../controllers/admin.controller.js";
const adminRouter = express.Router();

adminRouter.post("/createAdmin", createAdmin);

adminRouter.get("/getAdmins", allAdmins);

adminRouter.delete("/deleteAdmin/:id", deleteAdmin);

adminRouter.put("/updateAdmin/:id", updateAdmin);

// New route for deleting a user based on userType and ID
adminRouter.delete("/deleteUser/:userType/:id", deleteUser);
export default adminRouter;
