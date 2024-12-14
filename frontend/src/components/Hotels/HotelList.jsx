import React from "react";
import "./HotelList.css";
import HotelCard from "./HotelCard";
import usePageHeader from "../Header/UseHeaderPage";
import i1 from "../../assets/backgrounds/bookings_bg.png";
import HotelsControls from "./HotelsControls";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Footer from "../Footer";
const room = {
    name: "Grand City Hotel",
    address: "123 Main Street, New York, USA",
    addressLandmark: "New Downtown",
    city: "New York",
    image: "/room.png",
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
    //bookingId: 344542321, // when booked
    _id: "git-it-done",
};

const HotelList = () => {
    usePageHeader(i1, "Hotels");

    const [rooms, setRooms] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [chosenCity, setChosenCity] = useState(null);
    const [lat, setLat] = useState(searchParams.get("lat") || "");
    const [lng, setLng] = useState(searchParams.get("lng") || "");
    const [start, setStart] = useState(searchParams.get("start") || "");
    const [end, setEnd] = useState(searchParams.get("end") || "");

    // Parse guest count with a fallback
    const getGuestCount = () => {
        const guestCount = Number(searchParams.get("guests"));
        return isNaN(guestCount) || guestCount <= 0 ? 2 : guestCount;
    };
    const [guests, setGuests] = useState(getGuestCount());

    // Fetch rooms with current search parameters
    const fetchRooms = async (params) => {
        const url = "amadeus/hotels/search/hotel-offers-2"; // API endpoint
        console.log("Fetching hotel bookings with params:", params);

        try {
            const response = await axiosInstance.get(url, {
                params,
                withCredentials: true,
            });
            console.log("Fetched data:", response);
            response.data.hotels.forEach((hotel) => {
                hotel.chosenCity = chosenCity;
            });
            console.log("Fetched data:", response);
            setRooms(
                response.data.hotels.map((hotel) => {
                    return {
                        ...hotel,
                        totalPrice: hotel.totalPrice / 100,
                    };
                }) || []
            );
        } catch (err) {
            console.error("Error fetching rooms:", err);
            setRooms([]);
        }
    };

    const handleSearchButton = () => {
        console.log("Chosen city when clicked is:", chosenCity);

        const newParams = {
            lat: chosenCity?.geoCode?.latitude || lat,
            lng: chosenCity?.geoCode?.longitude || lng,
            guests,
            start: start.trim(),
            end: end.trim(),
        };

        setSearchParams(newParams);
        fetchRooms(newParams);
    };

    useEffect(() => {
        const newParams = {
            lat: searchParams.get("lat") || "",
            lng: searchParams.get("lng") || "",
            start: searchParams.get("start") || "",
            end: searchParams.get("end") || "",
            guests: getGuestCount(),
        };
        console.log("newParams", newParams);
        setLat(newParams.lat);
        setLng(newParams.lng);
        setStart(newParams.start);
        setEnd(newParams.end);
        setGuests(newParams.guests);
        fetchRooms(newParams);
    }, [searchParams]);

    return (
        <>
            <div className="hotel-list-with-controls">
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

                <div className="hotel-list-container">
                    <div className="hotel-grid">
                        {/* change later for rooms.map(offer=(item)) */}
                        {rooms?.map((item, index) => (
                            <HotelCard key={index} offer={item} isAllOffers={true} />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default HotelList;
