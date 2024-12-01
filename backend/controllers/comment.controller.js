import { ProfilingLevel } from "mongodb";
import Comment from "../models/comment.model.js";
import Complaint from "../models/complaint.model.js";
import {
    notifyAdminsAboutComplaint,
    sendNotificationToEmailAndSystem,
} from "./general.controller.js";
export const createComment = async (req, res) => {
    try {
        console.log("req.body", req.body);
        let data = { body: req.body.body, complaintID: req.body.complaintID };
        const parentComment = req.body.parentComment;
        data = { ...data, authorType: req.user.userType, author: req.user.userId };
        const comment = new Comment(data);
        await comment.save();

        console.log("1");
        const complaint = await Complaint.findById(req.body.complaintID);
        if (parentComment) {
            console.log("2");
            await Comment.findByIdAndUpdate(parentComment, {
                $push: { replies: comment._id },
            });
        } else {
            console.log("3");
            complaint.replies.push(comment._id);
            await complaint.save();
        }
        console.log("4");

        // notifying part

        if (req.user.userType === "Admin") {
            sendNotificationToEmailAndSystem(
                `A Reply to your complaint`,
                `A reply to your complaint ${complaint.title} has been posted by an admin.`,
                complaint.touristID,
                "Tourist",
                complaint._id,
                "Complaint"
            );
        } else if (req.user.userType === "Tourist") {
            notifyAdminsAboutComplaint(complaint.title, complaint._id, true);
        }

        res.status(201).json(comment);
    } catch (error) {
        console.log(error.message);
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

// export const populateReplies = async (comment) => {
//     // Populate author and direct replies of the comment
//     const populatedComment = await Comment.populate(comment, [
//         { path: "author", select: "name picture" },
//         { path: "replies" },
//     ]);

//     // Recursively populate replies if they exist
//     if (populatedComment.replies?.length) {
//         populatedComment.replies = await Promise.all(
//             populatedComment.replies.map((reply) => populateReplies(reply))
//         );
//     }

//     console.log("Populated Comment:", populatedComment);
//     return populatedComment;
// };

export const populateReplies = async (comment, level = 1) => {
    await comment.populate([
        { path: "author", select: "name picture" },
        { path: "replies" },
    ]);

    // Loop through each reply and recursively populate it
    for (let i = 0; i < comment.replies.length; i++) {
        comment.replies[i] = await populateReplies(comment.replies[i], level + 1); // Recursively populate each reply
    }
    console.log("Populated Comment at level ", level, comment);
    return comment;
};
