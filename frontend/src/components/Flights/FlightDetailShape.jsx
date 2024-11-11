// FlightDetailShape.js
// import React from "react";

const FlightDetailShape = ({ airlineName }) => {
    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginTop: "6vh",
            marginBottom: "2vh",
        },
        airlineName: {
            fontWeight: "bold",
            color: "#333",
            marginBottom: "2vh",
            marginLeft: "6vw",
            textAlign: "center",
        },
        shapeContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "8vw",
        },
        circle: {
            width: "1vw",
            height: "2vh",
            border: "2px solid #333",
            borderRadius: "50%",
            backgroundColor: "transparent",
        },
        line: {
            width: "0.1vw",
            height: "6vh",
            backgroundColor: "#333",
        },
    };

    return (
        <div style={styles.container}>
            {/* Airline Name */}
            <span style={styles.airlineName}>{airlineName || "Airline Name"}</span>

            {/* Circles with Connecting Line */}
            <div style={styles.shapeContainer}>
                {/* Top Circle */}
                <div style={styles.circle}></div>

                {/* Connecting Line */}
                <div style={styles.line}></div>

                {/* Bottom Circle */}
                <div style={styles.circle}></div>
            </div>
        </div>
    );
};

export default FlightDetailShape;
