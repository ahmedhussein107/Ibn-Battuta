import Complaint from "../models/complaint.model.js";
import Comment from "../models/comment.model.js";
import Admin from "../models/admin.model.js";
import { populateReplies } from "./comment.controller.js";
import { notifyAdminsAboutComplaint } from "./general.controller.js";
export const createComplaint = async (req, res) => {
    req.body.touristID = req.user?.userId;
    try {
        const newComplaint = await Complaint.create(req.body);
        notifyAdminsAboutComplaint(newComplaint.title, newComplaint._id);
        res.status(201).json(newComplaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllComplaints = async (req, res) => {
    const { status, sort } = req.query; // Accept "sort" query parameter
    try {
        // Define query with optional status filtering
        const query = status ? { status } : {};

        // Determine sorting order, default to newest first
        const sortOrder = sort === "oldest" ? 1 : -1;

        const complaints = await Complaint.find(query).sort({ createdAt: sortOrder });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getComplaintById = async (req, res) => {
    const { id } = req.params;
    try {
        const complaint = await Complaint.findById(id);
        if (complaint) {
            res.status(200).json(complaint);
        } else {
            res.status(404).json({ message: "Complaint not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateComplaintById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const complaint = await Complaint.findByIdAndUpdate(id, updates, {
            new: true,
        }).populate("touristID", "name picture");
        if (complaint) {
            res.status(200).json(complaint);
        } else {
            res.status(404).json({ message: "Complaint not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteComplaintById = async (req, res) => {
    const { id } = req.params;
    try {
        const complaint = await Complaint.findByIdAndDelete(id);
        if (complaint) {
            res.status(200).json({ message: "Complaint deleted successfully" });
        } else {
            res.status(404).json({ message: "Complaint not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTouristComplaints = async (req, res) => {
    const touristID = req.user?.userId;
    try {
        const complaints = await Complaint.find({ touristID }); // Find all complaints for the given tourist ID
        res.status(200).json(complaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSomeComplaints = async (req, res) => {
    try {
        console.log(req.query);
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const isSorted = req.query.isSorted;
        const status = req.query.status;
        const skip = (page - 1) * limit;
        let query = {};
        if (req.user?.userType === "Tourist") {
            query = { touristID: req.user.userId };
        }
        if (status !== "all") {
            query = { ...query, status };
        }
        const totalComplaints = await Complaint.countDocuments(query);
        let complaints = await Complaint.find(query)
            .skip(skip)
            .limit(limit)
            .populate("touristID", "name picture");
        if (isSorted === "true") {
            complaints = complaints.sort({ createdAt: -1 }); // Sort by createdAt descending
        }
        res.status(200).json({
            complaints,
            totalPages: Math.ceil(totalComplaints / limit),
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
export const getComplaintAlongWithReplies = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id is:", id);
        const complaint = await Complaint.findById(id).populate(
            "touristID",
            "name picture"
        );
        if (complaint.reply) {
            let comment = await Comment.findById(complaint.reply);
            comment = await populateReplies(comment);
            console.log(complaint);
            console.log("full comment is:", comment);
            res.json({ data: { complaint, comment } });
        } else res.status(200).json({ data: { complaint, comment: null } });
    } catch (error) {
        console.error("Failed to fetch complaints:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
