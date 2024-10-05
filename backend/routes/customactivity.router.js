import CustomActivity from "../models/customactivity.model.js";
import express from "express";
import {
  createCustomActivity,
  getAllCustomActivities,
  updateCustomActivity,
  deleteCustomActivity,
} from "../controllers/customactivity.controller.js";

const customActivityRouter = express.Router();

customActivityRouter.post("/", createCustomActivity);

customActivityRouter.get("/", getAllCustomActivities);

customActivityRouter.put("/:id", updateCustomActivity);

customActivityRouter.delete("/:id", deleteCustomActivity);

export default customActivityRouter;
