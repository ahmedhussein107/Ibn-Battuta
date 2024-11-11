import React, { useState } from "react";
import "./NewComplaintPopUp.css";
import Button from "../Button";
import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";
import axiosInstance from "../../api/axiosInstance";
import PopUp from "../PopUpsGeneric/PopUp";
const ComplaintFormPopup = ({ isOpen, setIsOpen }) => {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");

	const handleSubmit = async () => {
		try {
			const response = await axiosInstance.post(
				"complaint/createComplaint",
				{
					title,
					body,
				},
				{
					withCredentials: true,
				}
			);
			setIsOpen(false);
			window.location.reload();
		} catch (err) {}
	};

	return (
		<PopUp
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			headerText={"File a Complaint"}
			actionText={"Submit"}
			handleSubmit={handleSubmit}
		>
			<div className="popup-body">
				<label>Title</label>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Enter complaint title"
				/>

				<label>Body</label>
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

export default ComplaintFormPopup;
