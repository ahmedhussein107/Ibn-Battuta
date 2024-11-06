import React from "react";
import "./NewComplaintPopUp";

import Button from "../Button";
import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";
import axiosInstance from "../../api/axiosInstance";
import { useState } from "react";
const CommentPopUp = ({ isOpen, setIsOpen, complaintId, parentComment }) => {
    const [body, setBody] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
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
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;
    return (
        <div className="popup-overlay">
            <div className="popup">
                {/* Header with Title and Close Button */}
                <div className="popup-header">
                    <h2>Write your comment</h2>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <HighlightOffSharpIcon />
                    </button>
                </div>

                <div className="popup-body">
                    <label>comment</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Enter complaint details"
                        rows="4"
                    />
                </div>

                {/* Cancel and Submit Buttons */}
                <div className="popup-footer">
                    <Button
                        stylingMode="2"
                        text={"cancel"}
                        handleClick={() => setIsOpen(false)}
                        customStyle={{
                            marginLeft: "20px",
                            width: "173px",
                            height: "55px",
                            minHieght: "70px",
                            borderRadius: "60px",
                        }}
                    />{" "}
                    <Button
                        stylingMode="submit"
                        text={"reply"}
                        handleClick={handleSubmit}
                        disabled={isLoading}
                        isLoading={isLoading}
                        customStyle={{
                            marginLeft: "20px",
                            width: "173px",
                            height: "55px",
                            minHieght: "70px",
                            borderRadius: "60px",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CommentPopUp;
