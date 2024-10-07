import React, { useEffect, useState } from "react";
import Timeline from "./Timeline";

const ItineraryForm = ({
    activities,
    customActivities,
    data,
    setData,
    createItinerary,
    tourguideID,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [price, setPrice] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [availableDates, setAvailableDates] = useState([]);
    const [timeline, setTimeline] = useState([]);

    const addActivityToTimeline = (activityType, activity, startTime, endTime) => {
        startTime = new Date(`2022-01-01T00:${startTime}:00.000Z`); // `2022-01-01T00:${startTime}:00.000Z`;
        endTime = new Date(`2022-01-01T00:${endTime}:00.000Z`);
        const newActivity = { activityType, activity, startTime, endTime };
        setTimeline([...timeline, newActivity]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Submit logic
        console.log({
            title,
            description,
            language,
            price,
            pickupLocation,
            dropoffLocation,
            availableDates,
            timeline,
            tourguideID,
        });
        await setData({
            name: title,
            description,
            language,
            price,
            pickup: pickupLocation,
            dropOff: dropoffLocation,
            availableDatesAndTimes: [availableDates],
            activities: timeline,
            tourguideID,
        });
    };

    useEffect(() => {
        console.log("data:", data);
        if (data) {
            createItinerary();
        }
    }, [data]);

    return (
        <>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Itinerary Title"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Language"
            />
            <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
            />
            <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Pickup Location"
            />
            <input
                type="text"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                placeholder="Drop-off Location"
            />
            <input
                type="date"
                value={availableDates}
                onChange={(e) => setAvailableDates(e.target.value)}
                placeholder="Available Dates and Times"
            />
            {/* Render the Timeline component */}
            <Timeline
                activities={activities}
                customActivities={customActivities}
                addActivityToTimeline={addActivityToTimeline}
            />

            <button type="submit" onClick={handleSubmit}>
                Create Itinerary
            </button>
        </>
    );
};

export default ItineraryForm;
