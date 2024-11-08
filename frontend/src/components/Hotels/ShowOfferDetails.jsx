import React from "react";
import "./ShowOfferDetails.css";
import "./HotelCard.css";
import MapComponent from "../MapComponent";
import { useLocation } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import Button from "../Button";
import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
const ShowOfferDetails = () => {
    const { state } = useLocation();
    const { offer } = state || {};
    console.log("offer in detail page", offer);
    const handleOnAction = async () => {
        setIsLoading(true);
        try {
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className="hotel-details-page-container">
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
                    <MapComponent />
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
                                <strong>Total Price:</strong> ${offer.totalPrice}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Button
                stylingMode="submit"
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
        </div>
    );
};
export default ShowOfferDetails;
