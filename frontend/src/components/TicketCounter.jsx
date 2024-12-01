import React, { useState, useEffect } from "react";
import "../styles/TicketCounter.css";

import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../hooks/currencyHooks";
const TicketCounter = ({ pricePerPerson, maxCount, currentCount, setCount }) => {
    const [maxReached, setMaxReached] = useState(currentCount >= maxCount);
    const totalPrice = currentCount * pricePerPerson;

    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);
    if (isLoading) {
        return <CircularProgress />;
    }
    const increment = () => {
        if (maxReached) return;
        setCount(currentCount + 1);
        if (currentCount + 1 == maxCount) {
            setMaxReached(true);
        }
    };
    const decrement = () => {
        if (currentCount > 1) {
            setCount(currentCount - 1);
            if (maxReached) setMaxReached(false);
        }
    };

    return (
        <div className="ticket-counter">
            <h2>Number of Tickets</h2>
            <div className="counter">
                <button onClick={decrement} className="counter-button">
                    -
                </button>
                <span className="ticket-count">{currentCount}</span>
                {!maxReached && (
                    <button onClick={increment} className="counter-button">
                        +
                    </button>
                )}
            </div>
            <div className="price-display">
                <div className="price-row">
                    <span>Price per person</span>
                    <span className="price">
                        {formatPrice(pricePerPerson.toFixed(2))}{" "}
                    </span>
                </div>
                <div className="price-row">
                    <span>Total Price</span>
                    <span className="price">{formatPrice(totalPrice.toFixed(2))} </span>
                </div>
            </div>
            {maxReached && (
                <span>
                    Cannot book more Tickets! Maximum free spots{" "}
                    {maxCount > 1 ? "are" : "is"} {maxCount}
                </span>
            )}
        </div>
    );
};

export default TicketCounter;
