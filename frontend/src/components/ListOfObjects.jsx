import React from "react";

const ObjectList = ({ data }) => {
	// Define inline styles as JavaScript objects
	const containerStyle = {
		width: "80%",
		margin: "0 auto",
		fontFamily: "Arial, sans-serif",
	};

	const listStyle = {
		listStyleType: "none",
		padding: 0,
	};

	const itemStyle = {
		backgroundColor: "#f0f8ff", // Light blue background
		marginBottom: "15px",
		padding: "15px",
		borderRadius: "8px",
		boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
		transition: "transform 0.2s ease-in-out",
	};

	const itemHoverStyle = {
		transform: "translateY(-5px)",
	};

	const paragraphStyle = {
		margin: "5px 0",
	};

	const strongStyle = {
		color: "#333", // Darker text for keys
	};

	return (
		<div style={containerStyle}>
			<ul style={listStyle}>
				{data && data.length > 0 ? (
					data.map((item, index) => (
						<li
							key={index}
							style={itemStyle}
							onMouseEnter={(e) =>
								(e.currentTarget.style.transform =
									itemHoverStyle.transform)
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.transform = "none")
							}
						>
							{/* Render each attribute of the object */}
							{Object.entries(item).map(([key, value]) => (
								<p key={key} style={paragraphStyle}>
									<strong style={strongStyle}>{key}:</strong>{" "}
									{JSON.stringify(value)}
								</p>
							))}
						</li>
					))
				) : (
					<p>No data available</p>
				)}
			</ul>
		</div>
	);
};

export default ObjectList;
