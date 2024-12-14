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
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import { useFunctionContext } from "../../contexts/FunctionContext";
import { MapWrapper } from "../MapWrapper";
import CheckoutPopup from "../CheckoutPopup";
import i1 from "../../assets/backgrounds/HH.png";

const ShowOfferDetails = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { offer } = state || {};
    localStorage.setItem("offer", JSON.stringify(offer));
    const [isLoading, setIsLoading] = useState(false);
    const [bookingId, setBookingId] = useState(offer.bookingId);
    const [packagePopup, setPackagePopup] = useState(false);
    const [hotel, setHotel] = useState(null);
    const [isCheckoutPopupOpen, setIsCheckoutPopupOpen] = useState(false);

    const currency = Cookies.get("currency") || "EGP";
    const currencyConverter = useCurrencyConverter(currency);
    const formatPrice = currencyConverter.formatPrice;
    const isCurrencyLoading = currencyConverter.isLoading;
    const convertPrice = currencyConverter.convertPrice;

    const { setSuccess, setFailure } = useFunctionContext();

    if (isCurrencyLoading) {
        return <CircularProgress />;
    }
    // const handleOnAction = async () => {
    // 	setIsLoading(true);

    // 	const handleSuccess = async () => {
    // 		const response = await axiosInstance.post(
    // 			"amadeus/hotels/book-hotel",
    // 			{ offer },
    // 			{
    // 				withCredentials: true,
    // 			}
    // 		);
    // 		const hotelResponse = await axiosInstance.get("/booking/checkPossiblePackageHotel", {
    // 			withCredentials: true,
    // 		});
    // 		const state = { tab: "Hotels", hotel: hotelResponse?.data?.hotel };
    // 		navigate("/tourist/bookings", { state }); // TODO: change the uri to tourist/bookings
    // 	};

    // 	const handleFailure = async () => {};

    // 	setSuccess(handleSuccess);
    // 	setFailure(handleFailure);

    // 	navigate("/tourist/payment", {
    // 		state: {
    // 			amount: convertPrice(offer.totalPrice),
    // 			currency,
    // 			headerImage: offer.image,
    // 		},
    // 	});

    // 	// try {
    // 	//     const response = await axiosInstance.post(
    // 	//         "amadeus/hotels/book-hotel",
    // 	//         {
    // 	//             offer,
    // 	//         },
    // 	//         {
    // 	//             withCredentials: true,
    // 	//         }
    // 	//     );
    // 	//     setBookingId(response.data.bookingId);
    // 	//     offer.bookingId = response.data.bookingId;
    // 	//     const hotelResponse = await axiosInstance.get(
    // 	//         "/booking/checkPossiblePackageHotel",
    // 	//         {
    // 	//             withCredentials: true,
    // 	//         }
    // 	//     );
    // 	//     console.log("hotelResponse ", hotelResponse.data);
    // 	//     if (hotelResponse.data && hotelResponse.data.hotel) {
    // 	//         setHotel(hotelResponse.data.hotel);
    // 	//     }
    // 	//     setPackagePopup(true);
    // 	// } catch (err) {
    // 	//     console.error("Error booking hotel:", err);
    // 	// } finally {
    // 	//     setIsLoading(false);
    // 	// }
    // };

    const handleSubmit = () => {
        setPackagePopup(false);
        setTimeout(() => navigate("/bookings"), 1000);
    };

    return (
        <div>
            <div
                style={{
                    width: "100vw",
                    height: "40vh",
                    color: "#FAE2B6",
                    backgroundImage: `url(${i1})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                }}
            >
                <div style={{ marginLeft: "40%", marginBottom: "5%" }}>
                    <h1
                        style={{
                            fontSize: "6rem",
                            fontWeight: "bold",
                            marginBottom: "1rem",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                            fontFamily: "serif",
                            userSelect: "none",
                        }}
                    >
                        Hotels
                    </h1>
                </div>
            </div>
            <div className="hotel-details-page-container">
                <CheckoutPopup
                    isOpen={isCheckoutPopupOpen}
                    setIsOpen={setIsCheckoutPopupOpen}
                    items={[
                        {
                            title: "Hotel",
                            price: offer.totalPrice,
                        },
                    ]}
                    successDirectUrl={"/tourist/bookings"}
                    headerImage={offer.image}
                    state={{ tab: "Hotels" }}
                    handleOnMount={() => {}}
                    handleOnSuccess={async (amountFromWallet) => {
                        console.log("handleOnSuccess called");
                        try {
                            const response = await axiosInstance.post(
                                "amadeus/hotels/book-hotel",
                                {
                                    offer: JSON.parse(localStorage.getItem("offer")),
                                    amountFromWallet,
                                },
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
                            localStorage.setItem(
                                "hotel",
                                JSON.stringify(hotelResponse?.data?.hotel || null)
                            );
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                    handleOnFailure={() => {}}
                />
                <div className="hotel-details-container">
                    <div className="hotel-details-info">
                        <h1
                            className="hotel-name"
                            style={{ color: "var(--accent-color)" }}
                        >
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
                                            {offer.guests} adult
                                            {offer.guests > 1 ? "s" : ""}
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
                        <MapWrapper>
                            <MapComponent
                                markerPosition={{
                                    lat: offer.lat || 31.3244,
                                    lng: offer.lng || 42.3242,
                                }}
                            />
                        </MapWrapper>
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
                            handleClick={() => {
                                setIsCheckoutPopupOpen(true);
                            }}
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
        </div>
    );
};
export default ShowOfferDetails;
