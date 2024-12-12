import FlightInfoDisplay from "./FlightInfoDisplay";

const FlightJourney = ({ flight, airlineName }) => {
    const formatDuration = (duration) => {
        let days = "";
        let hours = "";
        let minutes = "";
        let curr = "";
        for (let i = 0; i < duration.length; i++) {
            if (duration[i] === "D") {
                days = curr;
                curr = "";
            } else if (duration[i] === "H") {
                hours = curr;
                curr = "";
            } else if (duration[i] === "M") {
                minutes = curr;
                curr = "";
            } else if (duration[i] >= "0" && duration[i] <= "9") {
                curr += duration[i];
            }
        }
        if (!days) days = "0";
        if (!hours) hours = "0";
        if (minutes.length === 1) minutes = "0" + minutes;
        return parseInt(hours) + parseInt(days) * 24 + "h " + minutes;
    };

    const parseDurationToMinutes = (duration) => {
        let totalMinutes = 0;
        let curr = "";
        for (let char of duration) {
            if (char === "D") {
                totalMinutes += parseInt(curr) * 1440; // 1 day = 1440 minutes
                curr = "";
            } else if (char === "H") {
                totalMinutes += parseInt(curr) * 60; // 1 hour = 60 minutes
                curr = "";
            } else if (char === "M") {
                totalMinutes += parseInt(curr); // minutes
                curr = "";
            } else if (char >= "0" && char <= "9") {
                curr += char;
            }
        }
        return totalMinutes;
    };

    const totalFlightDurationMinutes = parseDurationToMinutes(flight.duration);
    const totalSegmentsDurationMinutes = flight.segments.reduce((acc, segment) => {
        return acc + parseDurationToMinutes(segment.duration);
    }, 0);

    const layoverTimeMinutes = totalFlightDurationMinutes - totalSegmentsDurationMinutes;
    const layoverHours = Math.floor(layoverTimeMinutes / 60);
    const layoverMinutes = layoverTimeMinutes % 60;
    const formattedLayoverTime = `${layoverHours}h ${layoverMinutes
        .toString()
        .padStart(2, "0")}m`;

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "3vh",
                    marginBottom: "5vh",
                }}
            >
                {flight.segments.map((segment, index) => {
                    const departureTime = new Date(
                        segment.departure.at
                    ).toLocaleTimeString("en-UK", { hour: "2-digit", minute: "2-digit" });
                    const departureLocation = `${segment.departure.iataCode}`;
                    const departureTerminal = segment.departure.terminal || "1";
                    const arrivalTime = new Date(segment.arrival.at).toLocaleTimeString(
                        "en-UK",
                        { hour: "2-digit", minute: "2-digit" }
                    );
                    const arrivalLocation = `${segment.arrival.iataCode}`;
                    const arrivalTerminal = segment.arrival.terminal || "1";

                    return (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                //alignItems: "center",
                                gap: "3vh",
                            }}
                        >
                            <FlightInfoDisplay
                                airlineName={airlineName}
                                duration={formatDuration(segment.duration)}
                                departureTime={departureTime}
                                departureLocation={departureLocation}
                                departureTerminal={departureTerminal}
                                arrivalTime={arrivalTime}
                                arrivalLocation={arrivalLocation}
                                arrivalTerminal={arrivalTerminal}
                            />

                            {index < flight.segments.length - 1 && (
                                <div style={{ marginTop: "0" }}>
                                    <div
                                        style={{
                                            width: "48vw",
                                            height: "6vh",

                                            display: "flex",
                                            alignItems: "center",
                                            paddingLeft: "3vw",
                                            border: "1px solid #333",
                                            borderRadius: "1vh",
                                            backgroundColor: "#ECD1B4",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "1.2rem",
                                                color: "#9C4F21",
                                                fontWeight: "normal",
                                            }}
                                        >
                                            {formattedLayoverTime} Connect in airport
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default FlightJourney;
