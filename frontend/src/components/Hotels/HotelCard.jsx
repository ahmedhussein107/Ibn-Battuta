import React, { useEffect, useState } from "react";
import "./HotelCard.css";
import usePageHeader from "../Header/UseHeaderPage";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import PersonIcon from "@mui/icons-material/Person";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import convertCurrency from "../../api/currency";
import Cookies from "js-cookie";
const HotelCard = ({ offer, isAllOffers = true }) => {
    const navigate = useNavigate();
    const [price, setPrice] = useState(offer.totalPrice);
    useEffect(() => {
        convertCurrency(offer.totalPrice, "EGP", Cookies.get("currency") || "USD").then(
            (result) => {
                setPrice(result);
            }
        );
    }, []);
    const handleShowMore = () => {
        navigate(`/hotel/offer-details/${offer._id}`, { state: { offer } });
        console.log("Show more clicked");
    };

    return (
        <div className="hotel-card">
            <h2 className="hotel-name">{offer.name} </h2>
            {!isAllOffers && (
                <h4 style={{ margin: "0" }}>Booking ID: {offer.bookingId}</h4>
            )}

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

            {/* Hotel Image */}
            <div className="hotel-image">
                <img src={offer.image} alt="Hotel Room" />
            </div>

            {/* Room Info */}
            <div className="room-description">
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
                        <BedIcon sx={{ verticalAlign: "middle", marginRight: "5px" }} />
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
                            {offer.bathrooms} Bathroom{offer.bathrooms > 1 ? "s" : ""}
                        </span>
                    </span>
                </div>
            </div>

            {/* Check-in, Check-out, and Pricing */}
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
                        <strong>Total Price:</strong> {Cookies.get("currency") || "EGP"}
                        {price}
                    </p>
                </div>
            </div>
            <div className="show-more-div">
                <Button
                    stylingMode="submit"
                    text={"Show details"}
                    handleClick={handleShowMore}
                    customStyle={{
                        width: "60%",
                        height: "3rem",
                        minHieght: "70px",
                        borderRadius: "30px",
                        marginBottom: "20px",
                    }}
                />
            </div>
        </div>
    );
};

export default HotelCard;
