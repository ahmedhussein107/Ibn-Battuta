import express from "express";
import Governor from "../models/governor.model.js";
import e from "express";
import {
    getGovernors,
    createGovernor,
    deleteGovernor,
    getGovernor,
    updateGovernor,
} from "../controllers/governor.controller.js";
const governorRouter = express.Router();

governorRouter.post("/createGovernor", createGovernor);

governorRouter.get("/getGovernors", getGovernors);

governorRouter.get("/getGovernor/:id", getGovernor);

governorRouter.delete("/deleteGovernor/:id", deleteGovernor);

governorRouter.patch("/updateGovernor/:id", updateGovernor);

export default governorRouter;
