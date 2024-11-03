import React from "react";
import PropTypes from "prop-types";
import "../styles/Button.css"; // Make sure to create and import your styling file

const Button = ({ stylingMode, text, handleClick, width }) => {
  return (
    <button
      className={`button${stylingMode}`} // Apply dynamic styling class based on `stylingMode` prop
      onClick={handleClick}
      style={{ width: width }} // Inline style for width
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
};

// Default props (optional)
Button.defaultProps = {
  handleClick: () => {},
  width: "auto",
};

export default Button;
