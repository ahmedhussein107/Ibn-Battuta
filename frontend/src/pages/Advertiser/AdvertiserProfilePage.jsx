/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";

const AdvertiserProfilePage = () => {
    const [response, setResponse] = useState(null);

    useEffect(() => {
        axiosInstance
            .get("/advertiser/getAdvertiserById", { withCredentials: true })
            .then((response) => {
                setResponse(response.data);
                console.log("Advertiser:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching Advertiser:", error);
            });
    }, []);

    return (
        <>
            <div>
                <Navbar />
                <h1>Advertiser Profile Page</h1>
                <h2>Welcome {response && response.username}!</h2>
            </div>
        </>
    );
};
export default AdvertiserProfilePage;
