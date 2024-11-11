import express from "express";
import {
	createComment,
	getComplaintComments,
	getCommentById,
	updateComment,
	deleteComment,
	getComments,
	replyToComplaint,
	replyToComment,
} from "../controllers/comment.controller.js";

import { isAuthenticated } from "../routers.middleware/authentication.js";

const commentRouter = express.Router();

commentRouter.post("/createcomment", isAuthenticated, createComment);

commentRouter.get("/getCommentByID/:id", getCommentById);

commentRouter.get("/getComments", getComments);

commentRouter.get("/getComplaintComments/:id", getComplaintComments);

commentRouter.put("/updateComment/:id", updateComment);

commentRouter.delete("/deleteComment/:id", deleteComment);

commentRouter.post("/replyToComplaint/:complaintID", replyToComplaint);

commentRouter.post("/replyToComment/:commentID", replyToComment);

export default commentRouter;
