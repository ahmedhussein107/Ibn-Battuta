import React from "react";

const TitleAndButtons = ({ title, buttons }) => {
    return (
        <div
            style={{
                width: "95%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <p
                style={{
                    marginTop: "1%",
                    marginBottom: "2%",
                    fontWeight: "bold",
                    fontSize: "3vh",
                }}
            >
                {title}
            </p>
            {buttons.map((button) => button)}
        </div>
    );
};

export default TitleAndButtons;
