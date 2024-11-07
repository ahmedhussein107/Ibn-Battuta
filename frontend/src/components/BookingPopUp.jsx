import React from "react";
import "./BookingPopUp.css";

import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";
import axiosInstance from "../api/axiosInstance";
import { useState } from "react";
import PopUp from "./PopUpsGeneric/PopUp";
import PopUpSuccess from "./PopUpsGeneric/PopUpSuccess";
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

    const handleSubmit = async () => {
        try {
            //buy ticket;

            setIsOpen(false);
            window.location.reload();
        } catch (err) {}
    };

    return (
        <PopUp
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            headerText={"Please fill in the following to complete your booking"}
            actionText={"Confirm"}
            handleSubmit={handleSubmit}
        >
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
        </PopUp>
        // <PopUpSuccess
        //     isOpen={isOpen}
        //     setIsOpen={setIsOpen}
        //     headerText={"Booking completed successfully"}
        //     bodyText={"You earned 1000 points"}
        // />
    );
};

export default BookingPopUp;
