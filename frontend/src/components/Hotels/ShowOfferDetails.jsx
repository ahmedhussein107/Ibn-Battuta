import React, { useEffect } from "react";
import "./ShowOfferDetails.css";
import "./HotelCard.css";
import MapComponent from "../MapComponent";
import { useLocation, useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import Button from "../Button";
import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { convertCurrency } from "../../api/currency";
import Cookies from "js-cookie";
import convert from "../../api/convert";
import PopUp from "../PopUpsGeneric/PopUp";
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import usePageHeader from "../Header/UseHeaderPage";
const ShowOfferDetails = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { offer } = state || {};
    usePageHeader(offer.image);

    const [isLoading, setIsLoading] = useState(false);
    const [bookingId, setBookingId] = useState(offer.bookingId);
    const [packagePopup, setPackagePopup] = useState(false);
    const [hotel, setHotel] = useState(null);
    const currency = Cookies.get("currency") || "EGP";
    const { _isLoading, formatPrice } = useCurrencyConverter(currency);
    if (_isLoading) {
        return <CircularProgress />;
    }
    const handleOnAction = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post(
                "amadeus/hotels/book-hotel",
                {
                    offer,
                },
                {
                    withCredentials: true,
                }
            );
            setBookingId(response.data.bookingId);
            offer.bookingId = response.data.bookingId;
            const hotelResponse = await axiosInstance.get(
                "/booking/checkPossiblePackageHotel",
                {
                    withCredentials: true,
                }
            );
            console.log("hotelResponse ", hotelResponse.data);
            if (hotelResponse.data && hotelResponse.data.hotel) {
                setHotel(hotelResponse.data.hotel);
            }
            setPackagePopup(true);
        } catch (err) {
            console.error("Error booking hotel:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        setPackagePopup(false);
        setTimeout(() => navigate("/bookings"), 1000);
    };
    return (
        <div className="hotel-details-page-container">
            {packagePopup && (
                <PopUp
                    isOpen={packagePopup}
                    setIsOpen={setPackagePopup}
                    headerText="Do you want to book a package?"
                    handleSubmit={handleSubmit}
                    handleOnClose={handleSubmit}
                >
                    <p>{`You are booking a flight to ${hotel.chosenCity.name}. Do you want to book a limousine to hotel ${hotel.name} for 1000 ${hotel.currency}?`}</p>
                </PopUp>
            )}
            <div className="hotel-details-container">
                <div className="hotel-details-info">
                    <h1 className="hotel-name" style={{ color: "var(--accent-color)" }}>
                        {offer.name}{" "}
                    </h1>

                    <div className="hotel-location">
                        <span className="icon-text">
                            <LocationOnIcon
                                sx={{
                                    varticalAlign: "middle",
                                    marginRight: "5px",
                                    color: "var(--accent-color)",
                                }}
                            />
                            <span className="city">{offer.city}</span>{" "}
                        </span>

                        <p className="address">{offer.address}</p>
                        <p className="extra-info">{offer.addressLandmark}</p>
                    </div>
                    <div className="hotel-image-section">
                        <img src={offer.image} alt="Hotel Room" />
                    </div>

                    <div className="offer-description">
                        <h2 style={{ color: "var(--accent-color)" }}>
                            Offer Description
                        </h2>

                        <div className="offer-description">
                            <h3 className="room-title">{offer.miniDescription}</h3>
                            <p style={{ marginLeft: "10px" }}>{offer.description}</p>

                            <div className="room-info">
                                <span className="icon-text">
                                    <PersonIcon
                                        sx={{
                                            verticalAlign: "middle",
                                            marginRight: "5px",
                                            color: "var(--accent-color)",
                                        }}
                                    />
                                    <span>
                                        {offer.guests} adult{offer.guests > 1 ? "s" : ""}
                                    </span>
                                </span>
                                <span className="icon-text">
                                    <BedIcon
                                        sx={{
                                            verticalAlign: "middle",
                                            marginRight: "5px",
                                            color: "var(--accent-color)",
                                        }}
                                    />
                                    <span>
                                        {offer.beds} Bed{offer.beds > 1 ? "s" : ""}
                                    </span>
                                </span>
                                <span className="icon-text">
                                    <BathtubIcon
                                        sx={{
                                            verticalAlign: "middle",
                                            marginLeft: "10px",
                                            marginRight: "5px",
                                            color: "var(--accent-color)",
                                        }}
                                    />
                                    <span>
                                        {offer.bathrooms} Bathroom
                                        {offer.bathrooms > 1 ? "s" : ""}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="details-grid">
                            <div className="check-dates">
                                <p>
                                    <strong>Check-In:</strong> {offer.checkIn}
                                </p>
                                <p>
                                    <strong>Check-Out:</strong> {offer.checkOut}
                                </p>
                            </div>
                            <div className="policy-price">
                                <p>
                                    <strong>Cancellation:</strong>{" "}
                                    {offer.cancellationPolicy}
                                </p>
                                <p>
                                    <strong>Payment:</strong> {offer.paymentMethod}
                                </p>
                                <p>
                                    <strong>Total Price:</strong>{" "}
                                    {formatPrice(offer.totalPrice)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hotel-booking">
                    <h4 style={{ color: "var(--accent-color)" }}>Show On Map</h4>
                    <MapComponent
                        markerPosition={{
                            lat: offer.lat || 31.3244,
                            lng: offer.lng || 42.3242,
                        }}
                    />
                </div>
            </div>
            {bookingId && (
                <div
                    style={{
                        border: "1px solid green",
                        paddingRight: "50px",
                        paddingLeft: "50px",
                        borderRadius: "40px",
                        height: "5vh",
                        width: "fit-content",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "3vh",
                    }}
                >
                    <h3 style={{ color: "black" }}>Your Booking ID: {bookingId}</h3>
                </div>
            )}

            <div style={{ display: "flex", gap: "5vw", marginTop: "7vh" }}>
                <Button
                    stylingMode="dark-when-hovered"
                    text="Back"
                    handleClick={() => navigate(-1)}
                    customStyle={{
                        width: "173px",
                        height: "55px",
                        minHieght: "70px",
                        borderRadius: "60px",
                    }}
                />
                {!bookingId && (
                    <Button
                        stylingMode="always-dark"
                        text="Book Now"
                        handleClick={handleOnAction}
                        disabled={isLoading}
                        isLoading={isLoading}
                        customStyle={{
                            width: "173px",
                            height: "55px",
                            minHieght: "70px",
                            borderRadius: "60px",
                        }}
                    />
                )}
            </div>
        </div>
    );
};
export default ShowOfferDetails;
