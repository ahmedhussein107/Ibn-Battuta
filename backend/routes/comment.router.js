import express from "express";
import {
    createComment,
    getComplaintComments,
    getCommentById,
    updateComment,
    deleteComment,
    getComments,
} from "../controllers/comment.controller.js";

const commentRouter = express.Router();

commentRouter.post("/createcomment", createComment);

commentRouter.get("/getCommentByID/:id", getCommentById);

commentRouter.get("/getComments", getComments);

commentRouter.get("/getComplaintComments/:id", getComplaintComments);

commentRouter.put("/updateComment/:id", updateComment);

commentRouter.delete("/deleteComment/:id", deleteComment);

export default commentRouter;
