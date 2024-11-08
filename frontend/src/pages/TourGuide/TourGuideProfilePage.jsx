/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";

const TourguideProfilePage = () => {
    const [response, setResponse] = useState(null);

    useEffect(() => {
        axiosInstance
            .get("/tourguide/getTourguideById", { withCredentials: true })
            .then((response) => {
                setResponse(response.data);
                console.log("Tourguide:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching Tourguide:", error);
            });
    }, []);

    return (
        <>
            <div>
                <Navbar />
                <h1>Tourguide Profile Page</h1>
                <h2>Welcome {response && response.username}!</h2>
            </div>
        </>
    );
};
export default TourguideProfilePage;
