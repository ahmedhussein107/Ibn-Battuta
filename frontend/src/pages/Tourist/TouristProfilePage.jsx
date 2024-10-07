import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserProfile from "../../components/UserProfile";

export default function TouristProfilePage() {
    const touristId = "670281d434e70ef4d971f70a";
    const [tourist, setTourist] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        axiosInstance
            .get(`/tourist/tourist/${touristId}`)
            .then((response) => {
                const { _id, notifications, ...other } = response.data;
                setTourist(other);
                console.log("tourist:", tourist);
                setNotifications(notifications);
            })
            .catch((error) => {
                console.error("Error fetching tourist:", error);
            });
    }, []);

    const handleClick = () => {
        axiosInstance
            .patch(`/tourist/updateTourist/${touristId}`, tourist)
            .then((response) => {
                setResponse("Profile updated successfully!");
            })
            .catch((error) => {
                console.log(error);
                setResponse("Profile update failed!");
            });
    };
    const handleUsernameChange = (event) => {
        setTourist({ ...tourist, username: event.target.value });
    };

    return (
        <div>
            <h1>Tourist Profile Page</h1>
            {tourist && <UserProfile data={tourist} setData={setTourist} />}
            <button onClick={handleClick}>Update</button>
            {response && <p>{response}</p>}
        </div>
    );
}
