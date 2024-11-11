import usePageHeader from "../../components/Header/UseHeaderPage";
import backgroundImage from "../../assets/images/flightsBackgroundImage.png";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import FlightSearchPage from "../../components/Flights/FlightSearchPage";
import FlightDetailsPage from "../../components/Flights/FlightDetailsPage";
import PopUpSuccess from "../../components/PopUpsGeneric/PopUpSuccess";
import PopUpError from "../../components/PopUpsGeneric/PopUpError";

const Flights = () => {
    usePageHeader(null, null);
    const [step, setStep] = useState(1);
    const [keyword, setKeyword] = useState(""); // Search keyword
    const [keyword2, setKeyword2] = useState(""); // Search keyword
    const [startDate, setStartDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null); // Return Date
    const [departureAirport, setDepartureAirport] = useState(""); // Departure Airport
    const [arrivalAirport, setArrivalAirport] = useState(""); // Departure Airport
    const [adults, setAdults] = useState(0); // Number of adults
    const [children, setChildren] = useState(0); // Number of children
    const [flightOffers, setFlightOffers] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedFlightOffer, setSelectedFlightOffer] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [isBookingLoading, setIsBookingLoading] = useState(false);

    const buildQuery = () => {
        const query = {};

        if (departureAirport) {
            query.originLocationCode = departureAirport;
        }

        if (arrivalAirport) {
            query.destinationLocationCode = arrivalAirport;
        }

        if (startDate) {
            query.departureDate = new Date(startDate).toLocaleDateString("en-CA");
        }

        if (returnDate) {
            query.returnDate = new Date(returnDate).toLocaleDateString("en-CA");
        }

        if (adults) {
            query.adults = adults;
        }

        if (children) {
            query.children = children;
        }

        return query;
    };

    const handleSearch = async () => {
        const query = buildQuery();
        if (
            !query.originLocationCode ||
            !query.destinationLocationCode ||
            !query.departureDate ||
            !query.adults
        ) {
            setFlightOffers([]);
            setError("Please fill in all the required fields.");
            return;
        }
        try {
            setIsLoading(true);
            setError("");
            const response = await axiosInstance.get("/amadeus/flights/search/", {
                params: query,
            });
            console.log("response", response.data);
            //console.log("response", response.data.data);
            //console.log("response", response.data.dictionaries.carriers);
            if (response.data.data && response.data.data.length > 0) {
                setFlightOffers(response.data.data);
                setAirlines(response.data.dictionaries.carriers);
            } else {
                setError("No flights found.");
                setFlightOffers([]);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching Flights:", error);
            setError(error.message);
            setFlightOffers([]);
            setIsLoading(false);
        }
    };

    const handleView = (index) => {
        setSelectedFlightOffer(flightOffers[index]);
        setStep(2);
    };

    const handleBack = () => {
        setSelectedFlightOffer(null);
        setStep(1);
    };

    const handleBook = async () => {
        console.log(selectedFlightOffer);
        setIsBookingLoading(true);
        try {
            await axiosInstance.post(
                "/amadeus/flights/book",
                {
                    flightOffer: selectedFlightOffer,
                    airlines,
                },
                { withCredentials: true }
            );
            setIsBookingLoading(false);
            setSuccessOpen(true);
        } catch (error) {
            setIsBookingLoading(false);
            setErrorOpen(true);
        }
    };

    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            {/* Background Image */}
            <div
                style={{
                    width: "100vw",
                    height: "30vh",
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <h1
                    style={{
                        padding: "18vh", // Reduces top padding
                        fontSize: "3.2vh",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "2vh",
                        color: "white",
                    }}
                >
                    Flights
                </h1>
            </div>

            {/* NavBar */}
            <div style={{ position: "fixed", top: 0, left: "9%" }}>
                <NavBar />
            </div>

            {step == 1 && (
                <FlightSearchPage
                    keyword={keyword}
                    setKeyword={setKeyword}
                    keyword2={keyword2}
                    setKeyword2={setKeyword2}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    returnDate={returnDate}
                    setReturnDate={setReturnDate}
                    setDepartureAirport={setDepartureAirport}
                    setArrivalAirport={setArrivalAirport}
                    adults={adults}
                    setAdults={setAdults}
                    children={children}
                    setChildren={setChildren}
                    handleSearch={handleSearch}
                    isLoading={isLoading}
                    error={error}
                    flightOffers={flightOffers}
                    airlines={airlines}
                    handleView={handleView}
                />
            )}

            {step == 2 && (
                <FlightDetailsPage
                    handleBack={handleBack}
                    handleBook={handleBook}
                    isLoading={isBookingLoading}
                    flightData={selectedFlightOffer}
                    airlines={airlines}
                />
            )}

            {step == 2 && successOpen && (
                <PopUpSuccess
                    isOpen={successOpen}
                    setIsOpen={setSuccessOpen}
                    headerText="Booking Successful"
                    bodyText="Flight Booked Successfully"
                />
            )}

            {step == 2 && errorOpen && (
                <PopUpError
                    isOpen={errorOpen}
                    setIsOpen={setErrorOpen}
                    headerText="Booking Failed"
                    bodyText="An error occurred while booking. Please try again later."
                />
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Flights;
