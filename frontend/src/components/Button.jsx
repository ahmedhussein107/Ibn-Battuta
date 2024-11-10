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
<<<<<<< HEAD
    isLoading,
    width = "auto",
    customStyle = {},
    type,
=======
    isLoading = false,
    width = "auto",
    height = "auto",
    customStyle = {},
    type,
    icon = null,
>>>>>>> f3392822da9d06fd319386be44c09cf62408ffaf
}) => {
    return (
        <button
            className={`button-${stylingMode}`} // Apply dynamic styling class based on `stylingMode` prop
            onClick={handleClick}
<<<<<<< HEAD
            style={{ width: width, ...customStyle }} // Inline style for width
            type={type}
        >
            {isLoading ? <div className="spinner"></div> : text}
=======
            style={{ width: width, height: height, ...customStyle }} // Inline style for width
            type={type}
        >
            {isLoading ? (
                <span className="loader"></span>
            ) : (
                <>
                    {icon && <span className="button-icon">{icon}</span>}{" "}
                    {/* Render icon if provided */}
                    <span className="button-text">{text}</span>
                </>
            )}
>>>>>>> f3392822da9d06fd319386be44c09cf62408ffaf
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
