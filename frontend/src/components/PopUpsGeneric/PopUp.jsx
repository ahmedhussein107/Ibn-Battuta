import React from "react";
import "./PopUp.css";

import Button from "../Button";
import { useState } from "react";
import { IconButton } from "@mui/material";
import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";

const PopUp = ({ isOpen, setIsOpen, headerText, actionText, handleSubmit, children }) => {
    if (!isOpen) return null;
    const [isLoading, setIsLoading] = useState(false);
    const handleOnAction = () => {
        try {
            setIsLoading(true);
            handleSubmit();
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                {/* header of the oppup */}
                <div className="popup-header">
                    <div className="popup-header-left">
                        <IconButton
                            className="close-btn"
                            onClick={() => setIsOpen(false)}
                        >
                            <HighlightOffSharpIcon sx={{ paddingRight: 0 }} />
                        </IconButton>
                    </div>
                    <h2>{headerText}</h2>
                </div>
                {/* body of the popup */}
                {children}

                <div className="popup-footer">
                    {/* <Button
                        stylingMode="2"
                        text={"cancel"}
                        handleClick={() => {
                            setIsOpen(false);
                        }}
                        customStyle={{
                            marginLeft: "20px",
                            width: "173px",
                            height: "55px",
                            minHieght: "70px",
                            borderRadius: "60px",
                        }}
                    />{" "} */}
                    {/* footer of the popup */}
                    <Button
                        stylingMode="submit"
                        text={actionText}
                        handleClick={handleOnAction}
                        disabled={isLoading}
                        isLoading={isLoading}
                        customStyle={{
                            marginLeft: "20px",
                            width: "173px",
                            height: "55px",
                            minHieght: "70px",
                            borderRadius: "60px",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
export default PopUp;
