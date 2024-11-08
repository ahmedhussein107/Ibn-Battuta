import React from "react";
import usePageHeader from "../Header/UseHeaderPage";
import HotelList from "./HotelList";
const MyReservations = () => {
    usePageHeader(
        "https://cdn.pixabay.com/photo/2017/06/04/16/31/stars-2371478_1280.jpg",
        "My Reservations"
    );

    return <HotelList isAllOffers={false} />;
};
export default MyReservations;
