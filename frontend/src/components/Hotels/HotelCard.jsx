import React from "react";
import "./HotelCard.css";
import usePageHeader from "../Header/UseHeaderPage";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import PersonIcon from "@mui/icons-material/Person";
import Button from "../Button";
const HotelCard = () => {
    const handleShowMore = () => {
        console.log("Show more clicked");
    };
    return (
        <div className="hotel-card">
            {/* Hotel Name */}
            <h2 className="hotel-name">Grand City Hotel</h2>
            <h4 style={{ margin: "0" }}>Booking ID: 324224324</h4>

            {/* Location and Address */}
            <div className="hotel-location">
                <span className="icon-text">
                    <LocationOnIcon
                        sx={{ varticalAlign: "middle", marginRight: "5px" }}
                    />
                    <span className="city">New York City</span>{" "}
                </span>

                <p className="address">123 Main St, New York, NY</p>
                <p className="extra-info">Near Downtown</p>
            </div>

            {/* Hotel Image */}
            <div className="hotel-image">
                <img
                    src="https://www.cvent.com/sites/default/files/styles/focus_scale_and_crop_800x450/public/image/2021-10/hotel%20room%20with%20beachfront%20view.webp?h=662a4f7c&itok=7Laa3LkQ"
                    alt="Hotel Room"
                />
            </div>

            {/* Room Info */}
            <div className="room-description">
                <h3 className="room-title">Deluxe daf ddd fasdf sda</h3>
                <div className="room-info">
                    <span className="icon-text">
                        <PersonIcon
                            sx={{ verticalAlign: "middle", marginRight: "5px" }}
                        />
                        <span>2 adult{2 > 1 ? "s" : ""}</span>
                    </span>
                    <span className="icon-text">
                        <BedIcon sx={{ verticalAlign: "middle", marginRight: "5px" }} />
                        <span>2 Bed{2 > 1 ? "s" : ""}</span>
                    </span>
                    <span className="icon-text">
                        <BathtubIcon
                            sx={{
                                verticalAlign: "middle",
                                marginLeft: "10px",
                                marginRight: "5px",
                            }}
                        />
                        <span>1 Bathroom</span>
                    </span>
                </div>
            </div>

            {/* Check-in, Check-out, and Pricing */}
            <div className="details-grid">
                <div className="check-dates">
                    <p>
                        <strong>Check-In:</strong> 12:00 PM
                    </p>
                    <p>
                        <strong>Check-Out:</strong> 11:00 AM
                    </p>
                </div>
                <div className="policy-price">
                    <p>
                        <strong>Cancellation:</strong> Non-refundable
                    </p>
                    <p>
                        <strong>Payment:</strong> Credit Card
                    </p>
                    <p>
                        <strong>Total Price:</strong> $200
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
