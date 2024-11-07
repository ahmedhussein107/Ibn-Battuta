import React from "react";
import PopUp from "./PopUp";
const PopUpError = ({ isOpen, setIsOpen, headerText, bodyText }) => {
    return (
        <PopUp
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            headerText={headerText}
            cancelText={"Close"}
            containsActionButton={false}
        >
            <div className="popup-body">
                <div
                    className="popup-success-div"
                    style={{ textAlign: "center", color: "var(--primary-color)" }}
                >
                    <h5>⚠️ {" " + bodyText + " "}⚠️</h5>
                </div>
            </div>
        </PopUp>
    );
};
export default PopUpError;
