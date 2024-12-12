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
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1vw",
                    marginLeft: "10%",
                }}
            >
                {/* Airline shape component */}
                <FlightDetailShape airlineName={airlineName} duration={duration} />

                {/* Departure time and location */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6vh",
                        marginTop: "2.5vh",
                    }}
                >
                    <div>
                        <span
                            style={{
                                color: "black",
                                marginLeft: "0.2vw",
                                fontWeight: "normal",
                            }}
                        >
                            {departureTime} &nbsp; &nbsp;
                        </span>
                        <span
                            style={{
                                color: "black",
                                marginLeft: "0.2vw",
                                fontWeight: "normal",
                            }}
                        >
                            {`${departureLocation} (Terminal ${departureTerminal})`}
                        </span>
                    </div>

                    {/* Arrival time and location */}
                    <div>
                        <span
                            style={{
                                color: "black",
                                marginLeft: "0.2vw",
                                fontWeight: "normal",
                            }}
                        >
                            {arrivalTime} &nbsp; &nbsp;
                        </span>
                        <span
                            style={{
                                color: "black",
                                marginLeft: "0.2vw",
                                fontWeight: "normal",
                            }}
                        >
                            {`${arrivalLocation} (Terminal ${arrivalTerminal})`}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FlightInfoDisplay;
