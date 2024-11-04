import React from "react";
import { useState } from "react";
import "../styles/CommonForm.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const TouristFields = ({ userData, onChange }) => {
	return (
		<div className="common-form-step">
			{/* Mobile Number Input */}
			<div className="form-group">
				<label>Mobile Number</label>
				<PhoneInput
					preferredCountries={["us", "gb", "fr", "de", "it"]}
					onChange={(value) =>
						onChange({ target: { name: "mobileNumber", value } })
					}
					value={userData.mobileNumber || ""}
					required
					name="mobileNumber"
					className=""
				/>
			</div>
			{/* Date of Birth Input */}
			<div className="form-group">
				<label>Date of Birth</label>
				<input
					type="date"
					name="dateOfBirth"
					value={userData.dateOfBirth || ""}
					onChange={onChange}
					required
				/>
			</div>
			{/* Nationality Input */}
			<div className="form-group">
				<label>Nationality</label>
				<input
					type="text"
					name="nationality"
					value={userData.nationality || ""}
					onChange={onChange}
					placeholder="Enter your nationality"
					required
				/>
			</div>
			{/* Address Input */}
			<div className="form-group">
				<label>Address</label>
				<input
					type="text"
					name="address"
					value={userData.address || ""}
					onChange={onChange}
					placeholder="Enter your address"
					required
				/>
			</div>
			{/* Job Input */}
			<div className="form-group">
				<label>Job</label>
				<input
					type="text"
					name="job"
					value={userData.job || ""}
					onChange={onChange}
					placeholder="Enter your job"
					required
				/>
			</div>
		</div>
	);
};

export default TouristFields;
