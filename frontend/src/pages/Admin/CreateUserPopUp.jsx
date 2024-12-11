import React from "react";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import axiosInstance from "../../api/axiosInstance";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import "./UserManagement.css";
const CreateUserPopUp = ({ userType, isOpen, setIsOpen }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [popupAlert, setPopupAlert] = useState({
		open: false,
		severity: "info",
		message: "",
	});

	const handleSubmit = async () => {
		try {
			console.log("username", username);
			console.log("password", password);
			if (username === "") {
				showPopUpAlert("error", "Please enter a username");
				return;
			}
			if (password === "") {
				showPopUpAlert("error", "Please enter a password");
				return;
			}
			await axiosInstance.post(`${userType.toLowerCase()}/create${userType}`, {
				username,
				name: username,
				password,
			});
			showPopUpAlert("success", "User created successfully");
		} catch (err) {
			console.log(err);
			showPopUpAlert("error", err.response.data.message);
		} finally {
			//setIsOpen(false);
		}
	};

	const showPopUpAlert = (severity, message) => {
		setPopupAlert({ open: true, severity, message });

		setTimeout(() => {
			setPopupAlert({ open: false, severity: "", message: "" }); // Close the alert after some time
			// setIsOpen(false);
		}, 4000); // Alert will close after 5 seconds
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
			<div style={{ minWidth: "25vw" }}>
				<p style={{ fontWeight: "bold" }}>Username</p>
				<Box
					component="form"
					sx={{
						"& > :not(style)": { m: 1, width: "25ch" },
					}}
					autoComplete="off"
				>
					<TextField
						id="outlined-required"
						label="Username"
						onChange={(e) => setUsername(e.target.value)}
						style={{
							width: "100%",
							height: "4vh",
							marginTop: "1vh",
							marginLeft: "0vw",
							marginBottom: "2vh",
						}}
					/>
				</Box>
				{/* <input
                    type="text"
                    placeholder="Enter the username"
                    onChange={(e) => setUsername(e.target.value)}
                /> */}
				<p style={{ fontWeight: "bold" }}>Password</p>
				<Box
					component="form"
					sx={{
						"& > :not(style)": { m: 1, width: "25ch" },
					}}
					aria-required="true"
					autoComplete="off"
				>
					<TextField
						id="outlined-required"
						label="Password"
						type="password"
						onChange={(e) => setPassword(e.target.value)}
						style={{
							width: "100%",
							height: "4vh",
							marginTop: "1vh",
							marginLeft: "0vw",
							marginBottom: "2vh",
						}}
					/>
				</Box>
				{/* <input
                    type="password"
                    placeholder="Enter the password"
                    onChange={(e) => setPassword(e.target.value)}
                /> */}
			</div>
			{popupAlert.open && (
				<Alert
					severity={popupAlert.severity}
					onClose={() =>
						setPopupAlert({
							...popupAlert,
							open: false,
						})
					}
					style={{
						marginBottom: "1vh",
						fontSize: "1rem",
						textAlign: "center",
						marginTop: "2vh",
						width: "90%",
					}}
				>
					{popupAlert.message}
				</Alert>
			)}
		</PopUp>
	);
};

export default CreateUserPopUp;
