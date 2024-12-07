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
import Cookies from "js-cookie";
import PopUp from "../PopUpsGeneric/PopUp";
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import { useFunctionContext } from "../../contexts/FunctionContext";
const ShowOfferDetails = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { offer } = state || {};
    const [isLoading, setIsLoading] = useState(false);
    const [bookingId, setBookingId] = useState(offer.bookingId);
    const [packagePopup, setPackagePopup] = useState(false);
    const [hotel, setHotel] = useState(null);

    const currency = Cookies.get("currency") || "EGP";
    const currencyConverter = useCurrencyConverter(currency);
    const formatPrice = currencyConverter.formatPrice;
    const isCurrencyLoading = currencyConverter.isLoading;
    const convertPrice = currencyConverter.convertPrice;

    const { setSuccess, setFailure } = useFunctionContext();

    if (isCurrencyLoading) {
        return <CircularProgress />;
    }
    const handleOnAction = async () => {
        setIsLoading(true);

        const handleSuccess = async () => {
            const response = await axiosInstance.post(
                "amadeus/hotels/book-hotel",
                { offer },
                {
                    withCredentials: true,
                }
            );
            const hotelResponse = await axiosInstance.get(
                "/booking/checkPossiblePackageHotel",
                {
                    withCredentials: true,
                }
            );
            const state = { tab: "Hotels", hotel: hotelResponse?.data?.hotel };
            navigate("/bookings", { state }); // TODO: change the uri to tourist/bookings
        };

        const handleFailure = async () => {};

        setSuccess(handleSuccess);
        setFailure(handleFailure);

        navigate("/payment", {
            state: {
                amount: convertPrice(offer.totalPrice),
                currency,
                headerImage: offer.image,
            },
        });

        // try {
        //     const response = await axiosInstance.post(
        //         "amadeus/hotels/book-hotel",
        //         {
        //             offer,
        //         },
        //         {
        //             withCredentials: true,
        //         }
        //     );
        //     setBookingId(response.data.bookingId);
        //     offer.bookingId = response.data.bookingId;
        //     const hotelResponse = await axiosInstance.get(
        //         "/booking/checkPossiblePackageHotel",
        //         {
        //             withCredentials: true,
        //         }
        //     );
        //     console.log("hotelResponse ", hotelResponse.data);
        //     if (hotelResponse.data && hotelResponse.data.hotel) {
        //         setHotel(hotelResponse.data.hotel);
        //     }
        //     setPackagePopup(true);
        // } catch (err) {
        //     console.error("Error booking hotel:", err);
        // } finally {
        //     setIsLoading(false);
        // }
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
                    <h2 className="hotel-name">{offer.name} </h2>

                    <div className="hotel-location">
                        <span className="icon-text">
                            <LocationOnIcon
                                sx={{ varticalAlign: "middle", marginRight: "5px" }}
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
                        <h2>Offer Description</h2>
                        <p>{offer.description}</p>
                    </div>
                </div>
                <div className="hotel-booking">
                    <h4>Show On Map</h4>
                    {/* <MapComponent
                        setMarkerPosition={(position) => {
                            position.lat = offer.lat || "31.3244";
                            position.lng = offer.lng || "42.3242";
                        }}
                    /> */}
                    <div className="offer-description">
                        <h3 className="room-title">{offer.miniDescription}</h3>
                        <div className="room-info">
                            <span className="icon-text">
                                <PersonIcon
                                    sx={{ verticalAlign: "middle", marginRight: "5px" }}
                                />
                                <span>
                                    {offer.guests} adult{offer.guests > 1 ? "s" : ""}
                                </span>
                            </span>
                            <span className="icon-text">
                                <BedIcon
                                    sx={{ verticalAlign: "middle", marginRight: "5px" }}
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
                                <strong>Cancellation:</strong> {offer.cancellationPolicy}
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
            {!bookingId ? (
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
            ) : (
                <div
                    style={{
                        border: "1px solid green",
                        paddingRight: "50px",
                        paddingLeft: "50px",
                        borderRadius: "40px",
                    }}
                >
                    <h3 style={{ color: "black" }}>Your Booking ID: {bookingId}</h3>
                </div>
            )}
        </div>
    );
};
export default ShowOfferDetails;
