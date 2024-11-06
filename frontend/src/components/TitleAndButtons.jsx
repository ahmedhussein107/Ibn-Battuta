import React from "react";

const TitleAndButtons = ({ title, buttons }) => {
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
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
