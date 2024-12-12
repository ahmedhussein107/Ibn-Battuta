// FlightDetailShape.js
// import React from "react";

const FlightDetailShape = ({ airlineName, duration }) => {
    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        airlineName: {
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
        },
        overallContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0",
        },
        shapeContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
        duration: {
            color: "#757575",
            marginLeft: "0.2vw",
            fontWeight: "normal",
            marginTop: "1vh",
        },
    };

    return (
        <div style={styles.overallContainer}>
            <span style={styles.duration}>{duration}</span>
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
        </div>
    );
};

export default FlightDetailShape;
