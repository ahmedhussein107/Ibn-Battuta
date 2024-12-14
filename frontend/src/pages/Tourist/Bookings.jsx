import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import PaginationComponent from "../../components/Pagination";
import bookingsBackground from "../../assets/backgrounds/bookings_bg.png";
import Footer from "../../components/Footer";
import CardBooking from "../../components/CardBooking";
import TouristHotelBookings from "../../components/Hotels/TouristHotelBookings";
import FlightList from "../../components/Flights/FlightList";
import FilterButtons from "../../components/FilterButtons";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import { CircularProgress, Alert } from "@mui/material";

const Bookings = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 4;
    const [selected, setSelected] = useState("Itineraries");
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [flights, setFlights] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [filter, setFilter] = useState("All");
    const [error, setError] = useState("");

    const [popupOpen, setPopupOpen] = useState(false);
    const [popupContent, setPopupContent] = useState(null);

    const navigate = useNavigate();

    const handlePopupSubmit = () => {
        setPopupOpen(false);
    };

    const location = useLocation();
    console.log("state: ", location.state);

    useEffect(() => {
        if (location.state?.tab) setSelected(location.state.tab);
        if (location.state?.hotel) {
            const hotel = location.state.hotel;
            if (location.state?.tab == "Hotels") {
                setPopupOpen(true);
                const content = `You have a flight booked to ${
                    hotel?.chosenCity?.name || "Cairo"
                }. 
                                 Do you want to book a limousine to hotel ${
                                     hotel.name
                                 } for ${formatPrice(1000, hotel.currency || currency)} 
                                 ?`;
                setPopupContent(content);
            } else if (location.state?.tab == "Flights") {
                setPopupOpen(true);
                const content = `You can book a limousine with this flight to hotel ${
                    hotel.name
                }
                                 in ${
                                     hotel.chosenCity.name
                                 }. Do you want to book this package for 
                                  ${formatPrice(1000, hotel.currency || currency)}?`;
                setPopupContent(content);
            }
        }
        // TODO: handle the refresh
    }, []);

    const buttons = ["Itineraries", "Activities", "Flights", "Hotels"];
    const filterButtons = ["All", "Past", "Upcoming"];

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleChooseType = (page) => {
        setSelected(page);
        setFilter("All");
    };

    const handleFilter = (filter) => {
        setFilter(filter);
        console.log(filter);
    };

    const URI = {
        Itineraries: "booking/getItineraryBookings",
        Activities: "booking/getActivityBookings",
        Flights: "booking/getFlightBookings",
        Hotels: "booking/getHotelBookings",
    };

    const fetchBookings = async () => {
        try {
            const response = await axiosInstance.get(URI[selected], {
                params: {
                    page: currentPage,
                    limit: selected == "Hotels" ? 6 : itemsPerPage,
                    filter: filter,
                },
                withCredentials: true,
            });
            console.log("data ", response);
            switch (selected) {
                case "Itineraries": {
                    setItineraries(response.data.result);
                    break;
                }
                case "Activities":
                    setActivities(response.data.result);
                    break;
                case "Flights":
                    setFlights(response.data.result);
                    break;
                case "Hotels":
                    setHotels(response.data.result);
                    break;
            }
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        fetchBookings();
    }, [selected, filter]);
    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            {popupOpen && (
                <PopUp
                    isOpen={popupOpen}
                    setIsOpen={setPopupOpen}
                    headerText="Do you want to book a package?"
                    handleSubmit={handlePopupSubmit}
                    cancelText="No"
                    actionText="Yes"
                >
                    <p style={{ width: "40vw" }}>{popupContent}</p>
                </PopUp>
            )}
            <div style={backgroundStyle}>
                <h1 style={headerStyle}>My Bookings</h1>
            </div>
            <div style={{ padding: "1% 0" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "1% 0",
                    }}
                >
                    <FilterButtons
                        buttons={buttons}
                        selected={selected}
                        handleChooseType={handleChooseType}
                    />

                    <div style={filterButtonsGroupStyle}>
                        <FilterButtons
                            buttons={filterButtons}
                            selected={filter}
                            handleChooseType={handleFilter}
                        />
                    </div>
                </div>
                <hr style={{ width: "90%", margin: "0 auto" }} />

                <div style={itemsContainerStyle}>
                    {/* <GenericCard width="40vw" height="20vw" /> */}
                    {selected == "Activities" && activities && (
                        <>
                            {activities.map((booking) => (
                                <div style={{ padding: "1%" }}>
                                    <CardBooking
                                        booking={booking}
                                        width="46vw"
                                        height="34vh"
                                        fontSize="1.2rem"
                                        setError={setError}
                                    />
                                </div>
                            ))}
                        </>
                    )}
                    {selected == "Itineraries" && itineraries && (
                        <>
                            {itineraries.map((booking) => (
                                <div style={{ padding: "1%" }}>
                                    <CardBooking
                                        booking={booking}
                                        width="46vw"
                                        height="34vh"
                                        fontSize="1.2rem"
                                        setError={setError}
                                    />
                                </div>
                            ))}
                        </>
                    )}
                    {selected == "Flights" && (
                        <FlightList
                            flightBookings={flights}
                            mode={2}
                            handleView={(index) => {
                                console.log(index);
                            }}
                        />
                    )}
                    {selected == "Hotels" && <TouristHotelBookings rooms={hotels} />}
                </div>
                {error && (
                    <Alert severity="error" style={{ width: "90%", margin: "0 auto" }}>
                        {error}
                    </Alert>
                )}
                <PaginationComponent
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onChange={handlePageChange}
                />
            </div>
            <Footer />
        </div>
    );
};

const backgroundStyle = {
    width: "100vw",
    height: "30vh",
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${bookingsBackground})`,
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

const buttonGroupStyle = {
    display: "flex",
    gap: "10px",
    marginLeft: "1%",
};

const buttonStyle = {
    padding: "10px 20px",
    border: "4px solid ",
    borderRadius: "40px",
    borderColor: "#9C4F21",
    backgroundColor: "transparent",
    color: "#9C4F21",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease",
};

const selectedButtonStyle = {
    ...buttonStyle,
    //backgroundColor: "#9C4F21",
    backgroundColor: "#FAE2B6",
    color: "#9C4F21",
};

const filterButtonsGroupStyle = {
    marginLeft: "8.5vw",
    display: "flex",
    justifyContent: "center",
    marginRight: "2%",
};

const itemsContainerStyle = {
    paddingTop: "2vh",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
};

export default Bookings;
