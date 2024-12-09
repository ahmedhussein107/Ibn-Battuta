import React from "react";
import "./PopUp.css";

import PopUpHeader from "./PopUpHeader";
import PopUpFooter from "./PopUpFooter";
import { useRef, useEffect } from "react";

const stylesOfOverlay = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const PopUp = ({
    isOpen,
    setIsOpen,
    headerText,
    containsFooter = true,
    containsActionButton = true,
    cancelText = "Cancel",
    actionText = "Submit",
    handleSubmit = () => {},
    handleOnClose = () => {},
    children = null,
    zIndex = "1000",
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
        <div className="popup-overlay" style={{ ...stylesOfOverlay, zIndex }}>
            <div className="popup" ref={popupRef}>
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
