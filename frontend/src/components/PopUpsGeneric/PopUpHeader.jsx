import React from "react";
import IconButton from "@mui/material/IconButton";
import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";
import "./PopUp.css";
const PopUpHeader = ({ setIsOpen, headerText }) => {
    return (
        <div className="popup-header">
            <div className="popup-header-left">
                <IconButton className="close-btn" onClick={() => setIsOpen(false)}>
                    <HighlightOffSharpIcon sx={{ paddingRight: 0 }} />
                </IconButton>
            </div>
            <h2>{headerText}</h2>
        </div>
    );
};

export default PopUpHeader;
