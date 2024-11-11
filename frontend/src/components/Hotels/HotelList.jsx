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

const HotelList = () => {
    usePageHeader(
        "https://cdn.pixabay.com/photo/2017/06/04/16/31/stars-2371478_1280.jpg",
        "Welcome to the Hotels Page"
    );

    const [rooms, setRooms] = useState([]);
    const [citySearch, setCitySearch] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [lat, setLat] = useState(searchParams.get("lat") || "");
    const [lng, setLng] = useState(searchParams.get("lng") || "");
    const [start, setStart] = useState(searchParams.get("start") || "");
    const [end, setEnd] = useState(searchParams.get("end") || "");

    const getGuestCount = () => {
        const guestCount = Number(searchParams.get("guests"));
        return isNaN(guestCount) || guestCount <= 0 ? 2 : guestCount;
    };
    const [guests, setGuests] = useState(getGuestCount());
    const [chosenCity, setChosenCity] = useState(null);

    const fetchRooms = async () => {
        let url = "amadeus/hotels/search/hotel-offers";
        console.log("Fetching hotel bookings...");
        console.log("lat is ", lat);
        try {
            const { data } = await axiosInstance.get(url, {
                params: {
                    lat,
                    lng,
                    start,
                    end,
                    guests,
                },
                withCredentials: true,
            });
            console.log("Fetched data:", data);
            setRooms(data.data);
        } catch (err) {
            console.error("Error fetching rooms:", err);
            setRooms([]);
        }
    };

    const handleSearchButton = () => {
        console.log("Chosen city when clicked is:", chosenCity);
        let newParams = {
            lat: chosenCity?.geoCode?.latitude,
            lng: chosenCity?.geoCode?.longitude,
        };
        if (guests) newParams.guests = guests;
        if (start.trim()) newParams.start = start;
        if (end.trim()) newParams.end = end;

        console.log("Updating search parameters:", newParams);
        setSearchParams(newParams);
        setCitySearch(chosenCity);
    };

    useEffect(() => {
        const newLat = searchParams.get("lat") || "";
        const newLng = searchParams.get("lng") || "";
        const newStart = searchParams.get("start");
        const newEnd = searchParams.get("end");
        const newGuests = getGuestCount();

        setLat(newLat);
        setLng(newLng);
        setStart(newStart);
        setEnd(newEnd);
        setGuests(newGuests);

        if (newLat && newLng) {
            fetchRooms();
        }
    }, [searchParams]);

    const getRoomDetails = (roomOffer) => {
        const details = {
            name: roomOffer.hotel.name,
            address: "123 Main Street, New York, USA",
            addressLandmark: "New Downtown",
            city: `${citySearch.name}, ${citySearch.address.countryCode}`,
            image: "https://cdn.pixabay.com/photo/2017/06/04/16/31/stars-2371478_1280.jpg",
            rooms: 1,
            bathrooms: 1,
            beds: roomOffer.offers[0].room.typeEstimated.beds,
            guests: guests,
            totalPrice: roomOffer.offers[0].price.total,
            checkIn: roomOffer.offers[0].checkInDate,
            checkOut: roomOffer.offers[0].checkOutDate,
            cancellationPolicy: "Free cancellation",
            paymentMethod: "Credit Card",
            miniDescription: "This is a sample description.",
            description:
                "This is a long description for the room with additional information.",
            bookingId: 344542321,
            _id: "unique-room-id",
        };
        return details;
    };

    useEffect(() => {
        const newLat = searchParams.get("lat") || "";
        const newLng = searchParams.get("lng") || "";
        const newStart = searchParams.get("start");
        const newEnd = searchParams.get("end");
        const newGuests = getGuestCount();

        setLat(newLat);
        setLng(newLng);
        setStart(newStart);
        setEnd(newEnd);
        setGuests(newGuests);

        if (newLat && newLng) {
            fetchRooms();
        }
    }, [searchParams]);
    useEffect(() => {
        if (citySearch) {
            fetchRooms();
            console.log("city search is", citySearch);
        }
    }, [citySearch]);
    return (
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
                    {Array.from({ length: 20 }).map((item, index) => (
                        <HotelCard
                            key={index}
                            offer={false ? getRoomDetails(room) : room}
                            isAllOffers={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelList;
