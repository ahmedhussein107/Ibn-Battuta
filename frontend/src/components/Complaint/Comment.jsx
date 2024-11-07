import React from "react";
import "./Comment.css"; // Custom styles
import CommentPopUp from "./NewCommentPopUp";
import ReplySharpIcon from "@mui/icons-material/ReplySharp";
// Sample user image (this would typically come from your data)
const defaultUserImage =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const formatDate = (dateString) => {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
};

const Comment = ({ comment, onReply }) => {
    if (!comment) {
        return null;
    }

    return (
        <div className="comment">
            {/* User Profile Image and Comment Block */}
            <div
                className={`comment-left ${
                    comment.replies && comment.replies.length > 0 ? "has-replies" : ""
                }`}
            >
                <img
                    src={comment.author?.picture || defaultUserImage}
                    alt={comment.author?.name}
                    className="author-image"
                />
                <div className="author-name">{comment.author?.name}</div>
            </div>

            <div className="comment-right">
                <div className="comment-body">
                    <p className="comment-text">{comment.body}</p>
                    <div className="comment-footer">
                        <span className="comment-date">
                            {formatDate(comment.createdAt)}
                        </span>
                        <div className="reply-div" onClick={() => onReply(comment._id)}>
                            <ReplySharpIcon
                                sx={{ verticalAlign: "middle", marginRight: "5px" }}
                            />
                            reply
                        </div>
                    </div>
                </div>

                {comment.replies && comment.replies.length > 0 && (
                    <div className="replies">
                        {comment.replies.map((reply) => (
                            <Comment key={reply._id} comment={reply} onReply={onReply} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;
