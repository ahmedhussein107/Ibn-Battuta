import "../styles/ShareAndMark.css";
import React, { useState } from "react";
import PropTypes from "prop-types";

export default function ShareAndMark({
    width = "25%",
    height = "100%",
    styles = {},
    onSecondIconClick = () => {
        console.log("Balabizak"); // Default function for onSecondIconClick
    },
    direction = "",
    mode = "card",
    isBookmarked = false,
    showBookmark = false,
    icon = "markIcon",
    scale = 1,
}) {
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    const copyToClipboard = () => {
        const baseUri = window.location.origin;
        const link = direction === "" ? window.location.href : baseUri + direction;
        navigator.clipboard.writeText(link);
        setShowCopiedMessage(true);
        // Hide the message after 2 seconds
        setTimeout(() => {
            setShowCopiedMessage(false);
        }, 2000);
    };

    const emailFriend = () => {
        const baseUri = window.location.origin;
        const link = direction === "" ? window.location.href : baseUri + direction;
        const subject = "Check out this link!";
        const body = `Hi,\n\nI wanted to share this link with you: ${link}\n\nBest regards,`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, "_blank");
    };

    function scaleValue(input, scale) {
        // Use a regular expression to separate the number and the unit
        const match = input.match(/^([+-]?\d*\.?\d+)([a-z%]+)$/i);

        if (!match) {
            throw new Error(
                "Invalid input format. Must be a number followed by units, e.g., '10vh'."
            );
        }

        const number = parseFloat(match[1]); // Extract and parse the numeric part
        const unit = match[2]; // Extract the unit part

        const scaledNumber = number * scale; // Scale the number

        return `${scaledNumber}${unit}`; // Concatenate scaled number with the unit
    }

    const secondIconWidth = scaleValue(width, scale);
    const secondIconHeight = scaleValue(height, scale);

    return (
        <div
            className="icon-dropdown-container"
            style={{ width: width, height: height, ...styles }}
        >
            {/* Mark Icon */}
            {showBookmark && (
                <div className="icon" onClick={onSecondIconClick}>
                    <img
                        src={isBookmarked ? `/${icon}Filled.png` : `/${icon}.png`}
                        alt="Second Icon"
                        style={
                            mode === "card"
                                ? { width: secondIconWidth, height: secondIconHeight }
                                : {}
                        }
                    />
                </div>
            )}

            {/* Share with Dropdown */}
            <div className="icon">
                <img
                    src="/shareIcon.png"
                    alt="Dropdown Icon"
                    style={mode === "card" ? { width: width, height: height } : {}}
                />

                <div className="dropdownlist">
                    <div className="dropdownlist-option" onClick={copyToClipboard}>
                        Copy
                        {/* "Copied to clipboard" message */}
                        {showCopiedMessage && (
                            <span className="copied-message">Copied to clipboard</span>
                        )}
                    </div>
                    <div className="dropdownlist-option" onClick={emailFriend}>
                        Email a Friend
                    </div>
                </div>
            </div>
        </div>
    );
}
ShareAndMark.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    styles: PropTypes.object,
    onSecondIconClick: PropTypes.func.isRequired,
    mode: PropTypes.string,
};
