import Button from "../Button";
import TripDetails from "./TripDetails";

import Cookies from "js-cookie";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import { CircularProgress } from "@mui/material";

const FlightCard = ({ trip, airlines, handleClick, mode = 1, bookingNumber }) => {
    const styles = {
        card: {
            width: "45vw",
            height: mode == 2 ? "28vh" : "25vh",
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
            //alignItems: "center", // Center horizontally
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
        bookingNumber: {
            fontSize: "1vw",
            color: "rgb(50,50,50)",
            fontWeight: 500,
            marginBottom: "3vh",
        },
        booking: {
            fontSize: "1vw",
            fontWeight: "bold",
            marginBottom: "3vh",
        },
        trips: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1vh",
        },
    };

    const currency = Cookies.get("currency") || "EGP";
    const { formatPrice, isLoading } = useCurrencyConverter(currency);

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div style={styles.card}>
            <div style={styles.cardLeft}>
                {mode == 2 && (
                    <div
                        style={{
                            margin: "0 0 2% 0",
                            position: "relative",
                            top: "0",
                            left: "3%",
                        }}
                    >
                        {" "}
                        <span style={styles.booking}>{"Booking ID: "}</span>
                        <span style={styles.bookingNumber}>{bookingNumber}</span>
                    </div>
                )}
                <div style={styles.trips}>
                    {trip.itineraries.map((flight, index) => (
                        <TripDetails flight={flight} airlines={airlines} key={index} />
                    ))}
                </div>
            </div>

            <div style={styles.cardRight}>
                <h4>{formatPrice(trip.price.total)}</h4>
                <Button stylingMode="1" text="View" handleClick={handleClick}></Button>
            </div>
        </div>
    );
};

export default FlightCard;
