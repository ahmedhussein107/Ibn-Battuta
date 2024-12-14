import usePageHeader from "../../components/Header/UseHeaderPage";
import backgroundImage from "../../assets/backgrounds/flightsBackgroundImage.png";
import Footer from "../../components/Footer";
import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import FlightSearchPage from "../../components/Flights/FlightSearchPage";
import FlightDetailsPage from "../../components/Flights/FlightDetailsPage";
import PopUpSuccess from "../../components/PopUpsGeneric/PopUpSuccess";
import PopUpError from "../../components/PopUpsGeneric/PopUpError";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import { useNavigate } from "react-router-dom";
import { useFunctionContext } from "../../contexts/FunctionContext";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import CheckoutPopup from "../../components/CheckoutPopup";

const Flights = () => {
    const navigate = useNavigate();

    const { setSuccess, setFailure } = useFunctionContext();

    const currency = Cookies.get("currency") || "EGP";
    const currencyConverter = useCurrencyConverter(currency);
    const convertPrice = currencyConverter.convertPrice;
    const isCurrencyLoading = currencyConverter.isLoading;

    usePageHeader(null, null);
    const [step, setStep] = useState(1);
    const [keyword, setKeyword] = useState(""); // Search keyword
    const [keyword2, setKeyword2] = useState(""); // Search keyword
    const [startDate, setStartDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null); // Return Date
    const [departureAirport, setDepartureAirport] = useState(""); // Departure Airport
    const [arrivalAirport, setArrivalAirport] = useState(""); // Departure Airport
    const [adults, setAdults] = useState(1); // Number of adults
    const [children, setChildren] = useState(0); // Number of children
    const [flightOffers, setFlightOffers] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedFlightOffer, setSelectedFlightOffer] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [isBookingLoading, setIsBookingLoading] = useState(false);
    const [packagePopup, setPackagePopup] = useState(false);

    const [isCheckoutPopupOpen, setIsCheckoutPopupOpen] = useState(false);

    const [hotel, setHotel] = useState(null);
    const buildQuery = () => {
        const query = {};

        if (departureAirport) {
            query.originLocationCode = departureAirport.iataCode;
        }

        if (arrivalAirport) {
            query.destinationLocationCode = arrivalAirport.iataCode;
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
        flightOffers[index].departureCity = departureAirport.name;
        flightOffers[index].arrivalCity = arrivalAirport.name;
        flightOffers[index].departureDate = startDate;
        flightOffers[index].returnDate = returnDate;
        console.log("flightOffers[index]", flightOffers[index]);
        setSelectedFlightOffer(flightOffers[index]);
        setStep(2);
    };

    const handleBack = () => {
        setSelectedFlightOffer(null);
        setStep(1);
    };

    const handleSuccess = async () => {
        await axiosInstance.post(
            "/amadeus/flights/book",
            {
                flightOffer: selectedFlightOffer,
                airlines,
            },
            { withCredentials: true }
        );
        const response = await axiosInstance.get("/booking/checkPossiblePackageFlight/", {
            withCredentials: true,
        });
        const state = { tab: "Flights", hotel: response?.data?.hotel };
        navigate("/tourist/bookings", { state }); // TODO: change the uri to tourist/bookings
    };

    const handleBook = async () => {
        setIsCheckoutPopupOpen(true);
    };

    const handleOnClose = async () => {
        const response = await axiosInstance.get("/booking/checkPossiblePackageFlight/", {
            withCredentials: true,
        });
        console.log("response ", response.data);
        if (response.data && response.data.hotel) {
            setHotel(response.data.hotel);
            setPackagePopup(true);
        }
    };

    const handleSubmit = () => setPackagePopup(false);

    if (isCurrencyLoading) {
        return <CircularProgress />;
    }

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
                    departureAirport={departureAirport}
                    setDepartureAirport={setDepartureAirport}
                    arrivalAirport={arrivalAirport}
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

            {step == 2 && packagePopup && (
                <PopUp
                    isOpen={packagePopup}
                    setIsOpen={setPackagePopup}
                    headerText="Do you want to book a package?"
                    handleSubmit={handleSubmit}
                >
                    <p>{`You can book a limousine with this flight to hotel ${hotel.name} in ${hotel.chosenCity.name}. Do you want to book this package for 1000 ${hotel.currency}?`}</p>
                </PopUp>
            )}

            {step == 2 && errorOpen && (
                <PopUpError
                    isOpen={errorOpen}
                    setIsOpen={setErrorOpen}
                    headerText="Booking Failed"
                    bodyText="An error occurred while booking. Please try again later."
                />
            )}

            {step == 2 && successOpen && (
                <PopUpSuccess
                    isOpen={successOpen}
                    setIsOpen={setSuccessOpen}
                    headerText="Booking Successful"
                    bodyText="Flight Booked Successfully"
                    handleOnClose={handleOnClose}
                />
            )}

            {step == 2 && (
                <CheckoutPopup
                    isOpen={isCheckoutPopupOpen}
                    setIsOpen={setIsCheckoutPopupOpen}
                    items={[
                        {
                            title: "Flight",
                            price: selectedFlightOffer.price.total,
                        },
                    ]}
                    successDirectUrl={"/tourist/bookings"}
                    headerImage={backgroundImage}
                    state={{ tab: "Flights" }}
                    handleOnMount={async () => {
                        console.log("handleOnMount called");
                        localStorage.setItem(
                            "flightOffer",
                            JSON.stringify(selectedFlightOffer)
                        );
                        localStorage.setItem("airlines", JSON.stringify(airlines));
                    }}
                    handleOnSuccess={async (amountFromWallet) => {
                        console.log("handleOnSuccess called");
                        console.log("flightOffer", localStorage.getItem("flightOffer"));
                        console.log("airlines", localStorage.getItem("airlines"));
                        await axiosInstance.post(
                            "/amadeus/flights/book",
                            {
                                flightOffer: JSON.parse(
                                    localStorage.getItem("flightOffer")
                                ),
                                airlines: JSON.parse(localStorage.getItem("airlines")),
                                amountFromWallet,
                            },
                            { withCredentials: true }
                        );
                        const response = await axiosInstance.get(
                            "/booking/checkPossiblePackageFlight/",
                            {
                                withCredentials: true,
                            }
                        );
                        localStorage.removeItem("flightOffer");
                        localStorage.removeItem("airlines");
                        localStorage.setItem(
                            "hotel",
                            JSON.stringify(response?.data?.hotel || null)
                        );
                    }}
                    handleOnFailure={() => {}}
                />
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Flights;
