import express from "express";
import {
	createComplaint,
	getAllComplaints,
	getComplaintById,
	updateComplaintById,
	deleteComplaintById,
	getTouristComplaints,
	getSomeComplaints,
	getComplaintAlongWithReplies,
} from "../controllers/complaint.controller.js";

import { isAuthenticated } from "../routers.middleware/authentication.js";

const complaintRouter = express.Router();

complaintRouter.post("/createComplaint", isAuthenticated, createComplaint);

complaintRouter.get("/getComplaints", getAllComplaints);

complaintRouter.get("/getComplaint/:id", getComplaintById);
complaintRouter.get("/getComplaintAlongWithReplies/:id", getComplaintAlongWithReplies);

complaintRouter.put("/updateComplaint/:id", updateComplaintById);

complaintRouter.delete("/deleteComplaint/:id", deleteComplaintById);

complaintRouter.get("/getComplaintsOfTourist/:id", isAuthenticated, getTouristComplaints);

complaintRouter.get("/getSomeComplaints", isAuthenticated, getSomeComplaints);

export default complaintRouter;
