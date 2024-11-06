import React from "react";
import "./complaint/NewComplaintPopUp.css";

import Button from "./Button";
import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";
import axiosInstance from "../api/axiosInstance";
import { useState } from "react";
//count
//summary
const BookingPopUp = ({ isOpen, setIsOpen }) => {
    const [numberOfTickets, setNumberOfTickets] = useState(1);
    const itinerary = {
        _id: "6703f5310ecc1ad25ff95144",
        name: "tour in GUC",
        description:
            "best itinerary ever as ,I also love ahmed hussien because he is my friend",
        tourguideID: "6700044e887e126c909d6f21",
        activities: [
            {
                activityType: "Activity",
                activity: "670405f81ddb4f53fd971cd8",
                _id: "6703f5310ecc1ad25ff95145",
                id: "6703f5310ecc1ad25ff95145",
            },
        ],
        language: "Arabic",
        accessibility: ["weelchair", "ambulance cars"],
        price: 1000,
        availableDatesAndTimes: ["2024-12-20T00:00:00.000Z"],
        pickup: "GUC",
        dropOff: "GUC",
        tags: ["sky diving", "sea"],
        isActivated: true,
        isFlagged: false,
        ratings: ["672b666a8c7e37c372c27ebd"],
        sumOfRatings: 5,
        createdAt: "2024-10-07T14:50:25.807Z",
        updatedAt: "2024-11-06T12:51:54.972Z",
        location: "Cairo,Eg",
        picture: "https://i.postimg.cc/dtYPjDgS/guc.jpg",
        __v: 1,
        rating: 5,
        id: "6703f5310ecc1ad25ff95144",
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            setIsOpen(false);
            //buy ticket;
            window.location.reload();
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;
    return (
        <div className="popup-overlay">
            <div className="popup">
                <div className="popup-header">
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <HighlightOffSharpIcon />
                    </button>
                    <h2>Please fill in the following to complete your booking</h2>
                </div>

                <div className="ticket-container">
                    <div className="ticket-counter">
                        <button
                            className="counter-btn"
                            disabled={numberOfTickets === 1}
                            onClick={() => setNumberOfTickets(numberOfTickets - 1)}
                        >
                            -
                        </button>
                        <span id="ticket-count">{numberOfTickets}</span>
                        <button
                            className="counter-btn"
                            onClick={() => setNumberOfTickets(numberOfTickets + 1)}
                        >
                            +
                        </button>
                    </div>
                    <div className="price-info">
                        <p>
                            Price per person:{" "}
                            <span className="price-per-person">$ {itinerary.price}</span>
                        </p>
                        <p>
                            Total price:{" "}
                            <span id="total-price">
                                $ {itinerary.price * numberOfTickets}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="popup-footer">
                    <Button
                        stylingMode="2"
                        text={"cancel"}
                        handleClick={() => {
                            setIsOpen(false);
                        }}
                        customStyle={{
                            marginLeft: "20px",
                            width: "173px",
                            height: "55px",
                            minHieght: "70px",
                            borderRadius: "60px",
                        }}
                    />{" "}
                    <Button
                        stylingMode="submit"
                        text={"reply"}
                        handleClick={handleSubmit}
                        disabled={isLoading}
                        isLoading={isLoading}
                        customStyle={{
                            marginLeft: "20px",
                            width: "173px",
                            height: "55px",
                            minHieght: "70px",
                            borderRadius: "60px",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingPopUp;
