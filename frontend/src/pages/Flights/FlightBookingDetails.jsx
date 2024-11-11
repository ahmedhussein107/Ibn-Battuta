import FlightDetails from "../../components/Flights/FlightDetails";
import { useLocation } from "react-router-dom";
import bookingsBackground from "../../assets/backgrounds/bookingsBackground.png";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import Button from "../../components/Button";

const FlightBookingDetails = () => {
    const location = useLocation();
    const flight = location.state.flightOffer;
    const airlines = location.state.airlines;
    const bookingNumber = location.state.bookingNumber;
    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            {/* Background Image */}
            <div style={backgroundStyle}>
                <h1 style={headerStyle}>{`Booking ID: ${bookingNumber}`}</h1>
            </div>

            {/* NavBar */}
            <div style={{ position: "fixed", top: 0, left: "9%" }}>
                <NavBar />
            </div>

            <div
                style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <FlightDetails flightData={flight} airlines={airlines} />

                <Button
                    text="Back"
                    stylingMode="2"
                    handleClick={() => window.history.back()}
                    customStyle={{ marginBottom: "3vh" }}
                />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

const backgroundStyle = {
    width: "100vw",
    height: "30vh",
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bookingsBackground})`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    shadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const headerStyle = {
    position: "relative",
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "5%",
    color: "White",
};

export default FlightBookingDetails;
