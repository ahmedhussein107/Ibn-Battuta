import React from "react";
import BookingPopUp from "./BookingPopUp";

import { useState } from "react";
import HotelCard from "./Hotels/HotelCard";
const Test = () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div>
            <HotelCard />
        </div>
    );
};
export default Test;
