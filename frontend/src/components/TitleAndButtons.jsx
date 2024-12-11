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
                    fontWeight: "bold",
                    fontSize: "1em",
                }}
            >
                {title}
            </p>
            <div style={{ display: "flex", gap: "1em" }}>
                {buttons.map((button, index) => (
                    <div key={index}>{button}</div>
                ))}
            </div>
        </div>
    );
};

export default TitleAndButtons;
