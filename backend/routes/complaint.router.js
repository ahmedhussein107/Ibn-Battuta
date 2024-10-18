import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintById,
  deleteComplaintById,
} from "../controllers/complaint.controller.js";
import { get } from "mongoose";

const complaintRouter = express.Router();

complaintRouter.post("/createComplaint", createComplaint);

complaintRouter.get("/getComplaints", getAllComplaints);

complaintRouter.get("/getComplaint/:id", getComplaintById);

complaintRouter.put("/updateComplaint/:id", updateComplaintById);

complaintRouter.delete("/deleteComplaint/:id", deleteComplaintById);

export default complaintRouter;
