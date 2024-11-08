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
}) {
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
        const mailtoLink = `mailto:?body=${encodeURIComponent(window.location.href)}`;
        window.open(mailtoLink, "_blank");
    };

    return (
        <div
            className="icon-dropdown-container"
            style={{ width: width, height: height, ...styles }}
        >
            {/* Mark Icon */}
            <div className="icon" onClick={onSecondIconClick}>
                <img src="/markIcon.png" alt="Second Icon" />
            </div>

            {/* Share with Dropdown */}
            <div className="icon">
                <img src="/shareIcon.png" alt="Dropdown Icon" />

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
};
