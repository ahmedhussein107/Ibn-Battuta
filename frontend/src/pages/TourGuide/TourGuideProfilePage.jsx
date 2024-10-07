import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import InputForm from "../../components/Form";

export default function TourGuideProfilePage() {
    const tourGuideId = "670230844c652bfb008464d2";
    const [tourGuide, setTourGuide] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        axiosInstance
            .get(`/tourguide/tourGuide/${tourGuideId}`)
            .then((response) => {
                console.log(response.data);
                const { _id, notifications, ...tourGuide } = response.data;
                setTourGuide(tourGuide);
                console.log("tourGuide:", tourGuide);
                setNotifications(notifications);
            })
            .catch((error) => {
                console.error("Error fetching tour guide:", error);
            });
    }, []);

    const handleClick = () => {
        axiosInstance
            .patch(`/tourguide/updateTourGuide/${tourGuideId}`, tourGuide)
            .then((response) => {
                setResponse("Profile updated successfully!");
            })
            .catch((error) => {
                setResponse("Profile update failed!");
            });
    };

    return (
        <div>
            <h1>Tour Guide Profile Page</h1>
            {tourGuide && (
                <InputForm data={tourGuide} setData={setTourGuide} input={false} />
            )}
            <button onClick={handleClick}>Update</button>
            {response && <p>{response}</p>}
        </div>
    );
}
