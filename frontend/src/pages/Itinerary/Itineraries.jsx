import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import PopUpWindow from "../../components/PopUpWindow";
import { set } from "mongoose";

export default function Itineraries() {
    const [Itineraries, setItineraries] = useState(null);
    const [popup, setPopup] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        axiosInstance
            .get("/itinerary/getAllItineraries")
            .then((response) => {
                console.log(response.data);
                setItineraries(response.data);
            })
            .catch((error) => {
                console.error("Error fetching itineraries:", error);
            });
    }, []);

    const closePopup = () => {
        setPopup(false);
    };

    const openPopup = () => {
        setPopup(true);
    };

    return (
        <div>
            {popup && (
                <PopUpWindow
                    onClose={closePopup}
                    data={selectedData}
                    setData={setItineraries}
                />
            )}
            <h1>Itineraries</h1>
            {Itineraries && (
                <ul>
                    {Itineraries.map(
                        ({ _id, tourguideID, __v, createdAt, updatedAt, ...other }) => (
                            <li
                                key={_id}
                                onClick={() => {
                                    setSelectedId(_id);
                                    setSelectedData(other);
                                    openPopup();
                                }}
                            >
                                <h3>{_id}</h3>
                                <p>{tourguideID}</p>
                            </li>
                        )
                    )}
                </ul>
            )}
        </div>
    );
}
