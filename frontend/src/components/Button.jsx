import React from "react";
import PropTypes from "prop-types";
import "../styles/Button.css"; // Make sure to create and import your styling file

//Styling mode = 1 => White, 2 => Orange button. custumStyle to add additional styling if needed like width, height, margin ...
const Button = ({ stylingMode, text, handleClick, width, customStyle }) => {
	return (
		<button
			className={`button${stylingMode}`} // Apply dynamic styling class based on `stylingMode` prop
			onClick={handleClick}
			style={{ width: width, ...customStyle }} // Inline style for width
		>
			{text}
		</button>
	);
};

// Prop type validation (optional but recommended)
Button.propTypes = {
	stylingMode: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	handleClick: PropTypes.func,
	width: PropTypes.string,
	customStyle: PropTypes.object, // Allow an object for additional inline styles
};

// Default props (optional)
Button.defaultProps = {
	handleClick: () => {},
	width: "auto",
	customStyle: {}, // Default to an empty object
};

export default Button;
