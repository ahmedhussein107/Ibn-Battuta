import React from "react";
import BookingPopUp from "./BookingPopUp";

import { useState } from "react";
import HotelCard from "./Hotels/HotelCard";
import HotelList from "./Hotels/HotelList";
const Test = () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div>
            <HotelList />
        </div>
    );
};
export default Test;
