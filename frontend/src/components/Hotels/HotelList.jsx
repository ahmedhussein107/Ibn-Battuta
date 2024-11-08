import React from "react";
import "./HotelList.css";
import HotelCard from "./HotelCard";
import usePageHeader from "../Header/UseHeaderPage";
import HotelsControls from "./HotelsControls";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const HotelList = ({ isAllOffers = true }) => {
    if (isAllOffers) {
        usePageHeader(
            "https://cdn.pixabay.com/photo/2017/06/04/16/31/stars-2371478_1280.jpg",

            "Welcome to the Hotels Page"
        );
    }
    const [rooms, setRooms] = useState([]);
    const room = {
        name: "Grand City Hotel",
        address: "123 Main Street, New York, USA",
        addressLandmark: "New Downtown",
        city: "New York",
        image: "https://picsum.photos/200/300",
        rating: 4.5,
        rooms: 10,
        bathrooms: 8,
        beds: 15,
        guests: 20,
        totalPrice: 200,
        checkIn: "12:00 PM",
        checkOut: "10:00 PM",
        cancellationPolicy: "Free cancellation",
        paymentMethod: "Credit Card",
        description: "This is a sample description.",
        _id: 344542321,
    };
    let _list = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const location = searchParams.get("location");

    useEffect(() => {
        if (query) {
        }
    }, [query, location]);

    return (
        <div className="hotel-list-with-controls">
            {isAllOffers && <HotelsControls />}
            <div className="hotel-list-container">
                <div className="hotel-grid">
                    {_list.map((item) => (
                        <HotelCard key={item} offer={room} isAllOffers={isAllOffers} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelList;
