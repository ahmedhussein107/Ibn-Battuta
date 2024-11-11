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

const Bookings = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 4;
    const [selected, setSelected] = useState("Itineraries");
    const [bookings, setBookings] = useState([]);

    const buttons = ["Itineraries", "Activities", "Flights", "Hotels"];

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleChooseType = (page) => {
        setSelected(page);
    };

    const URI = {
        Itineraries: "booking/getItineraryBookings",
        Activities: "booking/getActivityBookings",
        Flights: "booking/getActivityBookings",
        Hotels: "booking/getHotelBookings",
    };

    const fetchBookings = async () => {
        try {
            const response = await axiosInstance.get(URI[selected], {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                },
                withCredentials: true,
            });
            console.log("response", response);
            setBookings(response.data.result);
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
    }, [selected]);

    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            <div style={backgroundStyle}>
                <h1 style={headerStyle}>My Bookings</h1>
            </div>
            <div style={{ padding: "1% 0" }}>
                <div style={buttonGroupStyle}>
                    {buttons.map((button) => (
                        <button
                            key={button}
                            onClick={() => handleChooseType(button)}
                            style={
                                selected === button ? selectedButtonStyle : buttonStyle
                            }
                        >
                            {button}
                        </button>
                    ))}
                </div>
                <div style={itemsContainerStyle}>
                    {/* <GenericCard width="40vw" height="20vw" /> */}
                    {(selected == "Itineraries" || selected == "Activities") && (
                        <>
                            {bookings.map((booking) => (
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
                    {selected == "Flights" && <> </>}
                    {selected == "Hotels" && <TouristHotelBookings rooms={bookings} />}
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

const itemsContainerStyle = {
    paddingTop: "2vh",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
};

export default Bookings;
