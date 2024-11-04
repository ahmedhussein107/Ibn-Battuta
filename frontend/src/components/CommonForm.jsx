import { Link } from "react-router-dom";
import "../styles/CommonForm.css";
import defaultUserImage from "../../public/default-user-plus.png"; // Path to your default image

import React from "react";
import { useState } from "react";

const CommonFormStep = ({ userData, onChange }) => {
	const [photoPreview, setPhotoPreview] = useState( userData.photo || defaultUserImage);

	const handlePhotoChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			// Create a preview URL for the selected image
			const reader = new FileReader();
			reader.onload = () => {
				setPhotoPreview(reader.result); // Update the preview image state
			};
			reader.readAsDataURL(file);
			onChange(event); // Pass the event up for handling
		}
	};
	return (
		<div className="common-form-step">
			{/* Photo Input */}
			<div className="form-group photo-upload">
				<label htmlFor="photoInput">
					<img
						src={photoPreview}
						alt="Upload"
						className="photo-preview"
						onClick={() =>
							document.getElementById("photoInput").click()
						}
					/>
				</label>
				<input
					type="file"
					id="photoInput"
					name="commonPhoto"
					accept="image/*"
					onChange={handlePhotoChange}
					style={{ display: "none" }} // Hide the actual input
				/>
			</div>
			{/* Name Input */}
			<div className="form-group">
				<label>Name </label>
				<input
					type="text"
					name="name"
					value={userData.name || ""}
					onChange={onChange}
					placeholder="Enter your name"
					required
				/>
			</div>
			{/* Username Input */}
			<div className="form-group">
				<label>Username</label>
				<input
					type="text"
					name="username"
					value={userData.username || ""}
					onChange={onChange}
					placeholder="Enter your username"
					required
				/>
			</div>
			{/* Email Input */}
			<div className="form-group">
				<label>Email</label>

				<input
					type="email"
					name="email"
					value={userData.email || ""}
					onChange={onChange}
					placeholder="Enter your email"
					required
				/>
			</div>
			{/* Password Input */}
			<div className="form-group">
				<label>Password</label>
				<input
					type="password"
					name="password"
					value={userData.password || ""}
					onChange={onChange}
					placeholder="Enter your password"
					required
				/>
			</div>
			<p>
				Already have and account? <Link to={"/signin"}> Sign in</Link>
			</p>
		</div>
	);
};

export default CommonFormStep;
