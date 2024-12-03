import React from "react";
import "./BookingPopUP.css";

import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";
import axiosInstance from "../api/axiosInstance";
import { useState } from "react";
import PopUp from "./PopUpsGeneric/PopUp";
import PopUpSuccess from "./PopUpsGeneric/PopUpSuccess";
import PopUpError from "./PopUpsGeneric/PopUpError";
import convert from "../api/convert";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
const BookingPopUp = ({
    isOpen,
    setIsOpen,
    BookingType = "Itinerary",
    toBeBookedItem = { _id: "6703f5310ecc1ad25ff95144", price: 2132 },
    touristID = "670442014aa7c398b29183c9",
}) => {
    const [numberOfTickets, setNumberOfTickets] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);
    if (isLoading) {
        return <CircularProgress />;
    }
    const handleSubmit = async () => {
        try {
            //buy ticket;
            await axiosInstance.post("/booking/createBooking", {
                touristID,
                bookingType: BookingType,
                typeId: toBeBookedItem._id,
                count: numberOfTickets,
                totalPrice: numberOfTickets * toBeBookedItem.price,
            });
            setIsOpen(false);
            setIsSuccess(true);
        } catch (err) {}
    };

    return (
        <>
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
                            <span className="price-per-person">
                                {formatPrice(toBeBookedItem.price)}
                            </span>
                        </p>
                        <p>
                            Total price:{" "}
                            <span id="total-price">
                                {formatPrice(toBeBookedItem.price * numberOfTickets)}
                            </span>
                        </p>
                    </div>
                </div>
            </PopUp>
            <PopUpSuccess
                isOpen={isSuccess}
                setIsOpen={setIsSuccess}
                headerText={"Booking completed successfully"}
                bodyText={`You earned ${Math.floor(
                    toBeBookedItem.price * numberOfTickets
                )} points`}
            />
            <PopUpError
                isOpen={isError}
                setIsOpen={setIsError}
                headerText={"An error occured while processing your request"}
                bodyText={"Please try again later"}
            />
        </>
    );
};

export default BookingPopUp;
