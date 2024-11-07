import React from "react";
import PropTypes from "prop-types";

const TruncatedText = ({ text, width, height, fontSize }) => {
    return (
        <div
            style={{
                width: width,
                height: height,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3, // Limits text to 3 lines
                WebkitBoxOrient: "vertical", // Vertical orientation for line clamping
                textOverflow: "ellipsis",
                whiteSpace: "normal", // Allows multi-line wrapping
                lineHeight: "1.5em", // Adjust line height as needed
                fontSize: fontSize,
            }}
        >
            {text}
        </div>
    );
};

TruncatedText.propTypes = {
    text: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
};

export default TruncatedText;
