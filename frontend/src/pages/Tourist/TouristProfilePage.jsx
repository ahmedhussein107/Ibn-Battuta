import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserProfile from "../../components/UserProfile";

export default function TouristProfilePage() {
  const touristId = "6702b0487857026633198d55";
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
    // Define the fields that should not be allowed for updates
    const disallowedFields = ["username", "email", "wallet", "points", "age"];

    // Check if any of the fields that are being updated are disallowed
    const isDisallowedUpdate = Object.keys(tourist).some((field) =>
      disallowedFields.includes(field)
    );

    if (isDisallowedUpdate) {
      setResponse("Updating these fields is not allowed.");
      return; // Exit early if an update to disallowed fields is attempted
    }

    // Proceed with the update if no disallowed fields are being changed
    axiosInstance
      .patch(`/tourist/tourist/${tourist}`, tourist)
      .then((response) => {
        setResponse("Profile updated successfully!");
      })
      .catch((error) => {
        setResponse("Profile update failed!");
      });
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
