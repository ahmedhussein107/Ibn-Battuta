import React from "react";
import FlightDetailShape from "./FlightDetailShape";

// FlightInfoDisplay component expects props to be passed in
const FlightInfoDisplay = ({
    airlineName,
    duration,
    departureTime,
    departureLocation,
    arrivalTime,
    arrivalLocation,
    departureTerminal,
    arrivalTerminal,
}) => {
    return (
        <>
            {/* Airline shape component */}
            <FlightDetailShape airlineName={airlineName} />

            {/* Duration of the flight */}
            <div
                style={{
                    position: "relative",
                    bottom: "10vh",
                    left: "9vh",
                    transform: "translateY(50%)",
                }}
            >
                <span
                    style={{
                        color: "#757575",
                        marginLeft: "0.2vw",
                        fontWeight: "normal",
                    }}
                >
                    {duration}
                </span>
            </div>

            {/* Departure time and location */}
            <div style={{}}>
                <span
                    style={{
                        position: "relative",
                        bottom: "16vh",
                        left: "23vh",
                        transform: "translateY(50%)",
                        color: "black",
                        marginLeft: "0.2vw",
                        fontWeight: "normal",
                    }}
                >
                    {departureTime}
                </span>
                <span
                    style={{
                        position: "relative",
                        bottom: "16vh",
                        left: "25vh",
                        transform: "translateY(50%)",
                        color: "black",
                        marginLeft: "0.2vw",
                        fontWeight: "normal",
                    }}
                >
                    {departureLocation}
                </span>
                <span
                    style={{
                        position: "relative",
                        bottom: "16vh",
                        left: "27vh",
                        transform: "translateY(50%)",
                        color: "black",
                        marginLeft: "0.2vw",
                        fontWeight: "normal",
                    }}
                >
                    Terminal {departureTerminal}
                </span>
            </div>

            {/* Arrival time and location */}
            <div>
                <span
                    style={{
                        position: "relative",
                        bottom: "11vh",
                        left: "23vh",
                        transform: "translateY(50%)",
                        color: "black",
                        marginLeft: "0.2vw",
                        fontWeight: "normal",
                    }}
                >
                    {arrivalTime}
                </span>
                <span
                    style={{
                        position: "relative",
                        bottom: "11vh",
                        left: "25vh",
                        transform: "translateY(50%)",
                        color: "black",
                        marginLeft: "0,2vw",
                        fontWeight: "normal",
                    }}
                >
                    {arrivalLocation}
                </span>
                <span
                    style={{
                        position: "relative",
                        bottom: "11vh",
                        left: "27vh",
                        transform: "translateY(50%)",
                        color: "black",
                        marginLeft: "0.2vw",
                        fontWeight: "normal",
                    }}
                >
                    Terminal {arrivalTerminal}
                </span>
            </div>
        </>
    );
};

export default FlightInfoDisplay;
