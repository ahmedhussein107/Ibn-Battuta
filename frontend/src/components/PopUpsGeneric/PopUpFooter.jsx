import React from "react";
import Button from "../Button.jsx";
import { useState } from "react";
import "./PopUp.css";
const PopUpFooter = ({
    setIsOpen,
    handleSubmit,
    cancelText,
    actionText,
    handleOnClose = () => {},
    containsActionButton = true,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleOnAction = async () => {
        try {
            setIsLoading(true);
            await handleSubmit();
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="popup-footer">
            <Button
                stylingMode="dark-when-hovered"
                text={cancelText}
                handleClick={() => {
                    setIsOpen(false);
                    handleOnClose();
                }}
                width="100%"
                customStyle={{
                    height: "55px",
                    minHieght: "70px",
                    borderRadius: "60px",
                }}
            />{" "}
            {/* footer of the popup */}
            {containsActionButton && (
                <Button
                    stylingMode="always-dark"
                    text={actionText}
                    handleClick={handleOnAction}
                    disabled={isLoading}
                    isLoading={isLoading}
                    width="100%"
                    customStyle={{
                        height: "55px",
                        minHieght: "70px",
                        borderRadius: "60px",
                    }}
                />
            )}
        </div>
    );
};

export default PopUpFooter;
