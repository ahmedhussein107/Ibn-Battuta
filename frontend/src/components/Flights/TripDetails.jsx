import PlaneIcon from "./PlaneIcon";
import TripLine from "./TripLine";

const TripDetails = ({ flight, airlines }) => {
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
            } else if (duration[i] - "0" >= 0 && duration[i] - "0" <= 9) {
                curr += duration[i];
            }
        }
        if (!days) {
            days = "0";
        }
        if (!hours) {
            hours = "0";
        }
        if (minutes.length == 1) {
            minutes = "0" + minutes;
        }
        return parseInt(hours) + parseInt(days) * 24 + "h " + minutes;
    };

    const formatTime = (time) => {
        const date = new Date(time);
        return date.toLocaleTimeString("en-UK", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
        });
    };

    function getDifferenceInDays(date1, date2) {
        const date1Split = date1.split("T")[0];
        const date2Split = date2.split("T")[0];
        // Parse the date strings into Date objects
        const firstDate = new Date(date1Split);
        const secondDate = new Date(date2Split);

        // Calculate the difference in milliseconds
        const differenceInMilliseconds = Math.abs(firstDate - secondDate);

        // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 ms)
        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

        return differenceInDays;
    }

    const styles = {
        tripDetails: {
            display: "flex",
            flexDirection: "row",
            gap: "1vw",
            height: "50%",
            alignItems: "center", // Center horizontally
            justifyContent: "center",
        },
        airline: { fontWeight: 600 },
        timeAndAirport: {
            display: "flex",
            flexDirection: "column", // Add this
            alignItems: "center", // Center horizontally
            justifyContent: "center",
            gap: "1vh",
        },
        time: {
            fontSize: "3vh",
            fontWeight: 500,
            color: "#63687a",
        },
        timeSmall: {
            fontSize: "1.3vh",
            fontWeight: 500,
            color: "#63687a",
        },
        airport: {
            fontSize: "2.5vh",
            fontWeight: 400,
            color: "#63687a",
        },
        flightOverview: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1vh",
            marginBottom: "1.35vh",
        },
        horizontal: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "0",
        },
        flightDuration: {
            fontSize: "2vh",
            fontWeight: 400,
            color: "#63687a",
        },
    };

    const diff = getDifferenceInDays(
        flight.segments[0].departure.at,
        flight.segments[flight.segments.length - 1].arrival.at
    );

    const diffString = diff > 0 ? `+${diff}` : "  ";

    return (
        <div style={styles.tripDetails}>
            <span style={styles.airline}>
                {airlines[flight.segments[0].operating.carrierCode]}
            </span>

            <div style={styles.timeAndAirport}>
                <span style={styles.time}>
                    {formatTime(flight.segments[0].departure.at)}
                </span>
                <span style={styles.airport}>
                    {flight.segments[0].departure.iataCode}
                </span>
            </div>

            <div style={styles.horizontal}>
                <div style={styles.flightOverview}>
                    <span style={styles.flightDuration}>
                        {formatDuration(flight.duration)}
                    </span>
                    <TripLine flight={flight} />
                </div>
                <PlaneIcon />
            </div>

            <div style={styles.timeAndAirport}>
                <div style={styles.horizontal}>
                    <span style={styles.time}>
                        {formatTime(
                            flight.segments[flight.segments.length - 1].arrival.at
                        )}
                    </span>
                    <span style={styles.timeSmall}>{diffString}</span>
                </div>
                <span style={styles.airport}>
                    {flight.segments[flight.segments.length - 1].arrival.iataCode}
                </span>
            </div>
        </div>
    );
};

export default TripDetails;
