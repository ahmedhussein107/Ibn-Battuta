import express from "express";
import Governor from "../models/governor.model.js";
import e from "express";
import {
    getGovernors,
    createGovernor,
    deleteGovernor,
    getGovernorById,
    updateGovernor,
} from "../controllers/governor.controller.js";
import { isAuthenticated } from "../routers.middleware/authentication.js";
const governorRouter = express.Router();

governorRouter.post("/createGovernor", createGovernor);

governorRouter.get("/getGovernors", getGovernors);

governorRouter.get("/getGovernorById", isAuthenticated, getGovernorById);

governorRouter.delete("/deleteGovernor/:id", deleteGovernor);

governorRouter.patch("/updateGovernor/:id", updateGovernor);

export default governorRouter;
