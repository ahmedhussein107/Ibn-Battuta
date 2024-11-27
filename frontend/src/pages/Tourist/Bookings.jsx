import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import PaginationComponent from "../../components/Pagination";
import bookingsBackground from "../../assets/backgrounds/bookingsBackground.png";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import GenericCard from "../../components/GenericCard";
import CardBooking from "../../components/CardBooking";
import TouristHotelBookings from "../../components/Hotels/TouristHotelBookings";
import HotelList from "../../components/Hotels/HotelList";
import FlightList from "../../components/Flights/FlightList";

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
            const today = new Date();
            today.setHours(0, 0, 0, 0);
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
    }, [currentPage, filter]);

    useEffect(() => {
        fetchBookings();
        setCurrentPage(1);
    }, [selected, filter]);

    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
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
                    <div style={buttonGroupStyle}>
                        {buttons.map((button) => (
                            <button
                                key={button}
                                onClick={() => handleChooseType(button)}
                                style={
                                    selected === button
                                        ? selectedButtonStyle
                                        : buttonStyle
                                }
                            >
                                {button}
                            </button>
                        ))}
                    </div>
                    <div style={filterButtonsGroupStyle}>
                        {filterButtons.map((button) => (
                            <button
                                key={button}
                                onClick={() => handleFilter(button)}
                                style={
                                    filter === button ? selectedButtonStyle : buttonStyle
                                }
                            >
                                {button}
                            </button>
                        ))}
                    </div>
                </div>

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

const buttonGroupStyle = {
    display: "flex",
    gap: "10px",
    marginLeft: "2%",
};

const buttonStyle = {
    padding: "10px 20px",
    border: "2px solid #000",
    borderRadius: "20px",
    backgroundColor: "transparent",
    color: "#000",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease",
};

const selectedButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#FF5722",
    color: "#fff",
};

const filterButtonsGroupStyle = {
    marginLeft: "8.5vw",
    display: "flex",
    justifyContent: "center",
};

const itemsContainerStyle = {
    paddingTop: "2vh",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
};

export default Bookings;
