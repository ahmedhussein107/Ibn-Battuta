import "../styles/ShareAndMark.css";
import React, { useState } from "react";
import PropTypes from "prop-types";

export default function ShareAndMark({ width, height, onSecondIconClick }) {
	const [showCopiedMessage, setShowCopiedMessage] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(window.location.href);
		setShowCopiedMessage(true);

		// Hide the message after 2 seconds
		setTimeout(() => {
			setShowCopiedMessage(false);
		}, 2000);
	};

	const emailFriend = () => {
		const mailtoLink = `mailto:?body=${encodeURIComponent(
			window.location.href
		)}`;
		window.open(mailtoLink, "_blank");
	};

	return (
		<div className="icon-dropdown-container">
			{/* First Icon with Dropdown */}
			<div className="icon">
				<img src="/shareIcon.png" alt="Dropdown Icon" />

				<div className="dropdown">
					<div className="dropdown-option" onClick={copyToClipboard}>
						Copy
						{/* "Copied to clipboard" message */}
						{showCopiedMessage && (
							<span className="copied-message">
								Copied to clipboard
							</span>
						)}
					</div>
					<div className="dropdown-option" onClick={emailFriend}>
						Email a Friend
					</div>
				</div>
			</div>

			{/* Second Icon */}
			<div className="icon" onClick={onSecondIconClick}>
				<img src="/markIcon.png" alt="Second Icon" />
			</div>
		</div>
	);
}
ShareAndMark.ptopTypes = {
	width: PropTypes.string,
	height: PropTypes.string,
	onSecondIconClick: PropTypes.func.isRequired,
};

ShareAndMark.defaultProps = {
	width: "100	%",
	height: "100%",
	onSecondIconClick: () => {
		console.log("Balabizak");
	},
};
