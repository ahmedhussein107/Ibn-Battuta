import React from "react";
import "./NewComplaintPopUp.css";
import axiosInstance from "../../api/axiosInstance";
import { useState } from "react";
import PopUp from "../PopUpsGeneric/PopUp";
const CommentPopUp = ({ isOpen, setIsOpen, complaintId, parentComment }) => {
    const [body, setBody] = useState("");

    const handleSubmit = async () => {
        try {
            const response = await axiosInstance.post(
                "comment/createComment",
                {
                    complaintID: complaintId,
                    body,
                    authorType: "Tourist",
                    author: "670442014aa7c398b29183c9",
                    parentComment: parentComment,
                },
                {
                    withCredentials: true,
                }
            );
            setIsOpen(false);
            window.location.reload();
        } catch (err) {}
    };

    if (!isOpen) return null;
    return (
        <PopUp
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            headerText={"Add your reply"}
            actionText={"reply"}
            handleSubmit={handleSubmit}
        >
            <div className="popup-body">
                <label>comment</label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Enter complaint details"
                    rows="4"
                />
            </div>
        </PopUp>
    );
};

export default CommentPopUp;
