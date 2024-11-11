import React from "react";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import axiosInstance from "../../api/axiosInstance";
import { useState } from "react";
import "./UserManagement.css";
const CreateUserPopUp = ({ userType, isOpen, setIsOpen }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const handleSubmit = async () => {
		try {
			await axiosInstance.post(`${userType.toLowerCase()}/create${userType}`, {
				username,
				name: username,
				password,
			});
		} catch (err) {
			setError(err.response.data.e);
		} finally {
			setIsOpen(false);
		}
	};
	return (
		<PopUp
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			headerText={"Create " + userType}
			cancelText="Cancel"
			actionText="Create"
			handleSubmit={handleSubmit}
		>
			<div class="create-user-input-container">
				<input
					type="text"
					placeholder="Enter the username"
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Enter the password"
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
		</PopUp>
	);
};

export default CreateUserPopUp;
