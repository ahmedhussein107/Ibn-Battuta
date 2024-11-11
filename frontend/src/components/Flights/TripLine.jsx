const TripLine = ({ flight }) => {
    const getStops = () => {
        return flight.segments.length - 1;
    };

    const stops = getStops();

    const getConnnections = () => {
        const stops = getStops();
        if (stops > 0) {
            let connections = "";
            for (let i = 0; i < stops; i++) {
                if (connections) {
                    connections += ", ";
                }
                connections += flight.segments[i].arrival.iataCode;
            }
            return connections;
        }
        return "";
    };

    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1vh",
        },
        lineContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.2vw",
        },
        oneLine: {
            width: "12vw",
            height: "0.5vh",
            backgroundColor: "#b9b7b7",
            border: "none",
        },
        twoLines: {
            width: "5vw",
            height: "0.5vh",
            backgroundColor: "#b9b7b7",
            border: "none",
        },
        threeLines: {
            width: "4vw",
            height: "0.5vh",
            backgroundColor: "#b9b7b7",
            border: "none",
        },
        fourLines: {
            width: "3vw",
            height: "0.5vh",
            backgroundColor: "#b9b7b7",
            border: "none",
        },
        shortLine: {
            width: "1vw",
            height: "0.5vh",
            backgroundColor: "#b9b7b7",
            border: "none",
        },
        ball: {
            backgroundColor: "#D41414",
            width: "1vh",
            height: "1vh",
            borderRadius: "0.5vh",
        },
        noConnections: {
            fontSize: "1.5vh",
            fontWeight: 300,
            color: "#1F9E3B",
        },
        connections: {
            fontSize: "1.5vh",
            fontWeight: 300,
            color: "#D41414",
        },
        connectionAirports: {
            fontSize: "1.5vh",
            fontWeight: 400,
            color: "#63687a",
        },
    };
    return (
        <div style={styles.container}>
            {stops == 0 ? (
                <div style={styles.lineContainer}>
                    <hr style={styles.oneLine} />
                </div>
            ) : stops == 1 ? (
                <div style={styles.lineContainer}>
                    <hr style={styles.twoLines} />
                    <div style={styles.ball}></div>
                    <hr style={styles.twoLines} />
                </div>
            ) : stops == 2 ? (
                <div>
                    <div style={styles.lineContainer}>
                        <hr style={styles.threeLines} />
                        <div style={styles.ball}></div>
                        <hr style={styles.shortLine} />
                        <div style={styles.ball}></div>
                        <hr style={styles.threeLines} />
                    </div>
                </div>
            ) : (
                <div>
                    <div style={styles.lineContainer}>
                        <hr style={styles.fourLines} />
                        <div style={styles.ball}></div>
                        <hr style={styles.shortLine} />
                        <div style={styles.ball}></div>
                        <hr style={styles.shortLine} />
                        <div style={styles.ball}></div>
                        <hr style={styles.fourLines} />
                    </div>
                </div>
            )}

            {stops > 1 ? (
                <div>
                    <span style={styles.connections}>{`${stops} stops`}</span>{" "}
                    <span style={styles.connectionAirports}>{getConnnections()}</span>
                </div>
            ) : stops == 1 ? (
                <div>
                    <span style={styles.connections}>{`${stops} stop`} </span>
                    <span style={styles.connectionAirports}>{getConnnections()}</span>
                </div>
            ) : (
                <div>
                    <span style={styles.noConnections}>Direct</span>
                    <span style={styles.connectionAirports}> </span>
                </div>
            )}
        </div>
    );
};

export default TripLine;
