import React from "react";
import "./HotelList.css";
import HotelCard from "./HotelCard";
import usePageHeader from "../Header/UseHeaderPage";
import HotelsControls from "./HotelsControls";
const HotelList = () => {
    usePageHeader(
        "https://cdn.pixabay.com/photo/2017/06/04/16/31/stars-2371478_1280.jpg",
        "Welcome to the Hotels Page"
    );
    let _list = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    return (
        <div className="hotel-list-with-controls">
            <HotelsControls />

            <div className="hotel-list-container">
                <div className="hotel-grid">
                    {_list.map((item) => (
                        <HotelCard key={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelList;
