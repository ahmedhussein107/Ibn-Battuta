import React from "react";
import "./HotelList.css";
import HotelCard from "./HotelCard";
import usePageHeader from "../Header/UseHeaderPage";
import HotelsControls from "./HotelsControls";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
const room = {
    name: "Grand City Hotel",
    address: "123 Main Street, New York, USA",
    addressLandmark: "New Downtown",
    city: "New York",
    image: "https://cdn.pixabay.com/photo/2017/06/04/16/31/stars-2371478_1280.jpg",
    rooms: 10,
    bathrooms: 8,
    beds: 15,
    guests: 20,
    totalPrice: 200,
    checkIn: "12:00 PM",
    checkOut: "10:00 PM",
    cancellationPolicy: "Free cancellation",
    paymentMethod: "Credit Card",
    miniDescription: "This is a sample description.",
    description:
        "This is the whole description for the room.it is a lot of text and unnecessary information",
    bookingId: 344542321, // when booked
    _id: "git-it-done",
};

const HotelList = ({ isAllOffers = true }) => {
    if (isAllOffers) {
        usePageHeader(
            "https://cdn.pixabay.com/photo/2017/06/04/16/31/stars-2371478_1280.jpg",
            "Welcome to the Hotels Page"
        );
    }
    const [rooms, setRooms] = useState([]);

    let _list = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

    const [searchParams, setSearchParams] = useSearchParams();

    const [lat, setLat] = useState(searchParams.get("lat") || "");
    const [lng, setLng] = useState(searchParams.get("lng") || "");
    const [start, setStart] = useState(searchParams.get("start") || "");
    const [end, setEnd] = useState(searchParams.get("end") || "");
    const [guests, setGuests] = useState(parseInt(searchParams.get("guests")) || 2);
    const [chosenCity, setChosenCity] = useState(null);

    const fetchRooms = async () => {
        let url = "/hotels";
        if (!isAllOffers) {
            url = "/hotels/my";
        }
        try {
            const response = await axiosInstance.get(url, {
                params: {
                    lat,
                    lng,
                    start,
                    end,
                    guests,
                },
                withCredentials: true,
            });
            setRooms(response.data);
        } catch (err) {
            console.log(err);
            setRooms([]);
        }
    };

    const handleSearchButton = async () => {
        const newParams = {};
        if (lat.trim()) newParams.lat = lat;
        if (lng.trim()) newParams.lng = lng;
        if (guests) newParams.guests = guests;
        if (start.trim()) newParams.start = start;
        if (end.trim()) newParams.end = end;
        console.log("the new params are", newParams);
        setSearchParams(newParams);
        await fetchRooms();
    };

    useEffect(() => {
        setLat(searchParams.get("lat") || "");
        setLng(searchParams.get("lng") || "");
        setStart(searchParams.get("start") || "");
        setEnd(searchParams.get("end") || "");
        setGuests(parseInt(searchParams.get("guests")) || 2);
        fetchRooms();
    }, [searchParams]);

    return (
        <div className="hotel-list-with-controls">
            {isAllOffers && (
                <HotelsControls
                    startDate={start}
                    setStartDate={setStart}
                    endDate={end}
                    setEndDate={setEnd}
                    guests={guests}
                    setGuests={setGuests}
                    onSearch={handleSearchButton}
                    chosenCity={chosenCity}
                    setChosenCity={setChosenCity}
                />
            )}
            <div className="hotel-list-container">
                <div className="hotel-grid">
                    {/* change later for rooms.map(offer=(item)) */}
                    {_list.map((item, index) => (
                        <HotelCard key={index} offer={room} isAllOffers={isAllOffers} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelList;
