import React from "react";
import PropTypes from "prop-types";
import "../styles/Button.css"; // Make sure to create and import your styling file

//Styling mode = 1 => White, 2 => Orange button. custumStyle to add additional styling if needed like width, height, margin ...
const Button = ({
    stylingMode,
    text,
    handleClick = () => {
        console.log("buttonclick handle needs to be fixed");
    },
    isLoading,
    width = "auto",
    height = "auto",
    customStyle = {},
    type,
}) => {
    return (
        <button
            className={`button-${stylingMode}`} // Apply dynamic styling class based on `stylingMode` prop
            onClick={handleClick}
            style={{ width: width, height: height, ...customStyle }} // Inline style for width
            type={type}
        >
            {isLoading ? <div className="spinner"></div> : text}
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

export default Button;
