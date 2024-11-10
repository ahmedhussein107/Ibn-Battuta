import Button from "../Button";
import TripDetails from "./TripDetails";

const FlightCard = ({ trip, airlines, handleClick }) => {
    const styles = {
        card: {
            width: "45vw",
            height: "25vh",
            margin: "2vh 2vw 2vh 2vw",
            display: "flex",
            flexDirection: "row",
            boxShadow: "0 2px 12px rgba(0,0,0,0.16)",
            borderRadius: "2vh",
            backgroundColor: "#f7f7f7", // Set the background color
        },
        cardLeft: {
            width: "80%",
            //backgroundColor: "#f0f0f0",
            borderRadius: "2vh 0 0 2vh",
            display: "flex",
            flexDirection: "column", // Add this
            alignItems: "center", // Center horizontally
            justifyContent: "center",
            gap: "1vh",
        },
        cardRight: {
            width: "20%",
            borderColor: "rgb(127,125,125)",
            borderStyle: "solid",
            borderWidth: "0 0 0 0.1vw",
            display: "flex",
            flexDirection: "column", // Add this
            alignItems: "center", // Center horizontally
            justifyContent: "center",
            gap: "1vh",
        },
    };

    return (
        <div style={styles.card}>
            <div style={styles.cardLeft}>
                {trip.itineraries.map((flight, index) => (
                    <TripDetails flight={flight} airlines={airlines} key={index} />
                ))}
            </div>

            <div style={styles.cardRight}>
                <h4>{`${trip.price.total} ${trip.price.currency}`}</h4>
                <Button stylingMode="1" text="View" handleClick={handleClick}></Button>
            </div>
        </div>
    );
};

export default FlightCard;
