import React from "react";
import "./HotelCard.css";
import usePageHeader from "../Header/UseHeaderPage";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import PersonIcon from "@mui/icons-material/Person";
import Button from "../Button";
const HotelCard = ({ offer, isAllOffers = true }) => {
    const handleShowMore = () => {
        console.log("Show more clicked");
    };
    return (
        <div className="hotel-card">
            {/* Hotel Name */}
            <h2 className="hotel-name">{offer.name} </h2>
            {!isAllOffers && <h4 style={{ margin: "0" }}>Booking ID: {offer._id}</h4>}

            {/* Location and Address */}
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
                <h3 className="room-title">{offer.description}</h3>
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
                        <strong>Total Price:</strong> ${offer.totalPrice}
                    </p>
                </div>
            </div>
            <Button
                stylingMode="submit"
                text={"Show details"}
                handleClick={handleShowMore}
                customStyle={{
                    width: "60%",
                    height: "2.5rem",
                    minHieght: "70px",
                    borderRadius: "30px",
                    marginBottom: "20px",
                }}
            />
        </div>
    );
};

export default HotelCard;
