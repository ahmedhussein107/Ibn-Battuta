import React from "react";
import "./ViewSingleComplaint.css";
import ComplaintCard from "./ComplaintCard";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import CommentPopUp from "./NewCommentPopUp";
import Comment from "./Comment";
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
	const [comment, setComment] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [parentComment, setParentComment] = useState(null);
	useEffect(() => {
		axiosInstance
			.get(`/complaint/getComplaintAlongWithReplies/${complaintId}`, {
				withCredentials: true,
			})
			.then((res) => {
				console.log("res:", res);
				setComplaint(res.data);
			});
	}, []);

	const onReply = (_parentComment) => {
		setParentComment(_parentComment);
		setIsOpen(true);
		console.log("reply clicked", _parentComment);
	};
	return (
		<>
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
			{!!comment && (
				<>
					<div className="comment-list">
						<Comment key={comment._id} comment={comment} onReply={onReply} />
					</div>
					<CommentPopUp
						key={comment._id}
						isOpen={isOpen}
						setIsOpen={setIsOpen}
						complaintId={complaintId}
						parentComment={parentComment}
					/>
				</>
			)}
		</>
	);
};
export default ViewSingleComplaint;
