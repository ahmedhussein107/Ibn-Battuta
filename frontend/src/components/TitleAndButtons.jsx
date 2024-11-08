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
                    fontSize: "1em",
                }}
            >
                {title}
            </p>
            {buttons.map((button, index) => (
                <div key={index}>{button}</div>
            ))}
        </div>
    );
};

export default TitleAndButtons;
