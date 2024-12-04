import React from "react";
import "./ViewSingleComplaint.css";
import ComplaintCard from "./ComplaintCard";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import CommentPopUp from "./NewCommentPopUp";
import Comment from "./Comment";
import usePageHeader from "../Header/UseHeaderPage";
import { useNavigate } from "react-router-dom";
const ViewSingleComplaint = () => {
    usePageHeader("/complaints.png", "Complaint Page");
    const navigate = useNavigate();
    const { complaintId } = useParams();
    const [complaint, setComplaint] = useState({
        title: "Title",
        body: "Body",
        status: "pending",
        touristID: {
            name: "Name",
        },
        replies: [],
        createdAt: "2023-09-10T12:34:56Z",
    });
    const [comments, setComments] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [parentComment, setParentComment] = useState(null);
    useEffect(() => {
        console.log("complaintId:", complaintId);
        axiosInstance
            .get(`/complaint/getComplaintAlongWithReplies/${complaintId}`, {
                withCredentials: true,
            })
            .then((res) => {
                console.log("res:", res);

                setComplaint(res.data.data.complaint);
                setComments(res.data.data.comments);
            })
            .catch((err) => {
                console.log("error i caught is:", err);
            });
    }, []);

    const onReply = (_parentComment) => {
        setParentComment(_parentComment);
        setIsOpen(true);
        console.log("reply clicked", _parentComment);
    };
    return (
        <>
            <div className="view-single-complaint">
                <div className="complaint-container">
                    <ComplaintCard
                        complaint={complaint}
                        isExpanded={true}
                        onReply={() => onReply(null)}
                        setComplaint={setComplaint}
                    />
                    <CommentPopUp
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        complaintId={complaintId}
                        parentComment={parentComment}
                    />
                </div>
                {!!comments && (
                    <>
                        <div className="comment-list">
                            {comments.map((comment) => (
                                <Comment
                                    key={comment._id}
                                    comment={comment}
                                    onReply={onReply}
                                />
                            ))}
                        </div>
                        <CommentPopUp
                            key={123}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            complaintId={complaintId}
                            parentComment={parentComment}
                        />
                    </>
                )}
            </div>

            <button className="complaint-back-button" onClick={() => navigate(-1)}>
                {" "}
                Back{" "}
            </button>
        </>
    );
};
export default ViewSingleComplaint;
