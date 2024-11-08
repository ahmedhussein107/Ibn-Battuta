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

const complaintRouter = express.Router();

complaintRouter.post("/createComplaint", createComplaint);

complaintRouter.get("/getComplaints", getAllComplaints);

complaintRouter.get("/getComplaint/:id", getComplaintById);
complaintRouter.get("/getComplaintAlongWithReplies/:id", getComplaintAlongWithReplies);

complaintRouter.put("/updateComplaint/:id", updateComplaintById);

complaintRouter.delete("/deleteComplaint/:id", deleteComplaintById);

complaintRouter.get("/getComplaintsOfTourist/:id", getTouristComplaints);

complaintRouter.get("/getSomeComplaints", getSomeComplaints);

export default complaintRouter;
