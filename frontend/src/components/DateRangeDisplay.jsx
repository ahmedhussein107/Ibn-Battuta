import React from "react";
import PropTypes from "prop-types";
import { FaCalendarAlt } from "react-icons/fa"; // Calendar icon from react-icons

const DateRangeDisplay = ({ startDate, endDate, width, height }) => {
	// Function to format date into 12-hour format with MM/DD/YY
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const options = {
			weekday: "short",
			month: "2-digit",
			day: "2-digit",
			year: "2-digit",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		};
		return date.toLocaleString("en-US", options);
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				border: "1px solid #ccc",
				borderRadius: "8px",
				padding: "10px",
				width,
				height,
				boxSizing: "border-box",
				backgroundColor: "#f9f9f9",
				boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
			}}
		>
			<div style={{ marginRight: "10px" }}>
				<FaCalendarAlt size={24} color="#666" /> {/* Calendar icon */}
			</div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div>
					<strong>From:</strong> {formatDate(startDate)}
				</div>
				<div>
					<strong>To:</strong> {formatDate(endDate)}
				</div>
			</div>
		</div>
	);
};

// Define prop types for type-checking
DateRangeDisplay.propTypes = {
	startDate: PropTypes.string.isRequired,
	endDate: PropTypes.string.isRequired,
	width: PropTypes.string,
	height: PropTypes.string,
};


export default DateRangeDisplay;
