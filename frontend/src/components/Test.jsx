import React from "react";
import BookingPopUp from "./BookingPopUp";
import { useState } from "react";
const Test = () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div>
            <BookingPopUp isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
};
export default Test;
