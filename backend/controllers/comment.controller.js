import Comment from "../models/comment.model.js";
import Complaint from "../models/complaint.model.js";

export const createComment = async (req, res) => {
    const comment = new Comment(req.body);
    try {
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getComplaintComments = async (req, res) => {
    const complaintID = req.params.id;
    try {
        const comments = await Comment.find({ complaintID });
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (comment) {
            res.status(200).json(comment);
        } else {
            res.status(404).json({ message: "Comment not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (comment) {
            res.status(200).json(comment);
        } else {
            res.status(404).json({ message: "Comment not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (comment) {
            res.status(200).json({ message: "Comment deleted successfully" });
        } else {
            res.status(404).json({ message: "Comment not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const replyToComplaint = async (req, res) => {
    const { complaintID } = req.params;
    try {
        const complaint = await Complaint.findById(complaintID);
        if (complaint) {
            const newReply = new Comment({ ...req.body, complaintID });
            await newReply.save(); // Save the new reply
            complaint.reply = newReply._id; // Add the new reply to the complaint
            await complaint.save(); // Save the updated comment
            res.status(201).json(newReply); // Return the created reply
        } else {
            res.status(404).json({ message: "Complaint not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const replyToComment = async (req, res) => {
    const { commentID } = req.params;
    try {
        const comment = await Comment.findById(commentID);
        if (comment) {
            const newReply = new Comment({
                ...req.body,
                complaintID: comment.complaintID,
            });
            await newReply.save(); // Save the new reply
            comment.replies.push(newReply._id); // Add the new reply to the comment
            await comment.save(); // Save the updated comment
            res.status(201).json(newReply); // Return the created reply
        } else {
            res.status(404).json({ message: "Comment not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
