import React from "react";
import "./PopUp.css";

import PopUpHeader from "./PopUpHeader";
import PopUpFooter from "./PopUpFooter";
import { useRef, useEffect } from "react";

const PopUp = ({
    isOpen,
    setIsOpen,
    headerText,
    containsFooter = true,
    containsActionButton = true,
    cancelText = "Cancel",
    actionText = "Submit",
    handleSubmit = () => {},
    children = null,
}) => {
    //     this part is for closing the popup when clicked outside
    const popupRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup" ref={popupRef}>
                <PopUpHeader headerText={headerText} setIsOpen={setIsOpen} />

                {children}
                {containsFooter && (
                    <PopUpFooter
                        setIsOpen={setIsOpen}
                        handleSubmit={handleSubmit}
                        cancelText={cancelText}
                        actionText={actionText}
                        containsActionButton={containsActionButton}
                    />
                )}
            </div>
        </div>
    );
};
export default PopUp;
