import React from "react";
import "./ViewSingleComplaint.css";
import ComplaintCard from "./ComplaintCard";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import CommentPopUp from "./NewCommentPopUp";
const ViewSingleComplaint = () => {
    const { complaintId } = useParams();
    const [complaint, setComplaint] = useState({
        title: "Title",
        body: "Body",
        status: "pending",
        touristID: {
            name: "Name",
        },
    });
    const [comment, setComment] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [parentComment, setParentComment] = useState(null);
    useEffect(() => {
        axiosInstance
            .get(`/complaint/getComplaintAlongWithReplies/${complaintId}`, {
                withCredentials: true,
            })
            .then((res) => {
                console.log("res body is :", res);
                const { reply, ..._complaint } = res.data;
                setComplaint(_complaint);
                setComment(reply);
            });
    }, []);

    const onReply = (parentComment) => {
        setParentComment(comment);
        setIsOpen(true);
        console.log("reply clicked");
    };
    return (
        <div className="complaint-container">
            <ComplaintCard
                complaint={complaint}
                isExpanded={true}
                onReply={() => onReply(null)}
            />
            <CommentPopUp
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                complaintId={complaintId}
                parentComment={parentComment}
            />
        </div>
    );
};
export default ViewSingleComplaint;
