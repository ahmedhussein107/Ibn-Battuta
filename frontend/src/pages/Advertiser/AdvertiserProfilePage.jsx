import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserProfile from "../../components/UserProfile";

export default function AdvertiserProfilePage() {
  const advertiserId = "67040377731df0ac20353236";
  const [advertiser, setAdvertiser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/advertiser/advertiser/${advertiserId}`)
      .then((response) => {
        const { _id, notifications, ...advertiser } = response.data;
        setAdvertiser(advertiser);
        console.log("advertiser:", advertiser);
        setNotifications(notifications);
      })
      .catch((error) => {
        console.error("Error fetching advertiser:", error);
      });
  }, []);

  const handleClick = () => {
    axiosInstance
      .patch(`/advertiser/updateadvertiser/${advertiserId}`, advertiser)
      .then((response) => {
        setResponse("Profile updated successfully!");
      })
      .catch((error) => {
        setResponse("Profile update failed!");
      });
  };

  return (
    <div>
      <h1>Advertiser Profile Page</h1>
      {advertiser && <UserProfile data={advertiser} setData={setAdvertiser} />}
      <button onClick={handleClick}>Update</button>
      {response && <p>{response}</p>}
    </div>
  );
}
