import React from "react";
import Button from "../Button.jsx";
import { useState } from "react";
import "./PopUp.css";
const PopUpFooter = ({
    setIsOpen,
    handleSubmit,
    cancelText,
    actionText,
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
                stylingMode="2"
                text={cancelText}
                handleClick={() => {
                    setIsOpen(false);
                }}
                customStyle={{
                    width: "173px",
                    height: "55px",
                    minHieght: "70px",
                    borderRadius: "60px",
                }}
            />{" "}
            {/* footer of the popup */}
            {containsActionButton && (
                <Button
                    stylingMode="submit"
                    text={actionText}
                    handleClick={handleOnAction}
                    disabled={isLoading}
                    isLoading={isLoading}
                    customStyle={{
                        width: "173px",
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
