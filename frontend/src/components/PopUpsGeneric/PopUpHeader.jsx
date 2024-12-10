import React from "react";
import IconButton from "@mui/material/IconButton";
import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";
import "./PopUp.css";
const PopUpHeader = ({ handleOnClose, headerText }) => {
    return (
        <div className="popup-header">
            <div className="popup-header-left">
                <IconButton
                    className="close-btn"
                    onClick={handleOnClose}
                    sx={{
                        width: "1vmin",
                        height: "2vmin",
                        margin: "1vmin",
                    }}
                >
                    <HighlightOffSharpIcon />
                </IconButton>
            </div>
            <h2>{headerText}</h2>
        </div>
    );
};

export default PopUpHeader;
