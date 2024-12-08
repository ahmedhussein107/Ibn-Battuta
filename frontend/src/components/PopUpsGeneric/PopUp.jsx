import React from "react";
import "./PopUp.css";

import PopUpHeader from "./PopUpHeader";
import PopUpFooter from "./PopUpFooter";
import { useRef, useEffect } from "react";
const customStyle = {
    background: "white",
    padding: "4vmin",
    height: "auto",
    borderRadius: "3vmin",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
};
const PopUp = ({
    isOpen,
    setIsOpen,
    headerText,
    width = "auto",
    containsFooter = true,
    containsActionButton = true,
    cancelText = "Cancel",
    actionText = "Submit",
    handleSubmit = () => {},
    handleOnClose = () => {},
    children = null,
}) => {
    //     this part is for closing the popup when clicked outside
    const popupRef = useRef(null);
    useEffect(() => {
        // const handleClickOutside = (event) => {
        //     if (isOpen && popupRef.current && !popupRef.current.contains(event.target)) {
        //         setIsOpen(false);
        //     }
        // };
        // document.addEventListener("mousedown", handleClickOutside);
        // // Remove event listener on unmount
        // return () => {
        //     document.removeEventListener("mousedown", handleClickOutside);
        // };
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div ref={popupRef} style={{ width, ...customStyle }}>
                <PopUpHeader headerText={headerText} setIsOpen={setIsOpen} />
                {children}
                {containsFooter && (
                    <PopUpFooter
                        setIsOpen={setIsOpen}
                        handleSubmit={handleSubmit}
                        handleOnClose={handleOnClose}
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
