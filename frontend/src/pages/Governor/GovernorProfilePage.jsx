/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";

const GovernorProfilePage = () => {
    const [response, setResponse] = useState(null);

    useEffect(() => {
        axiosInstance
            .get("/governor/getGovernorById", { withCredentials: true })
            .then((response) => {
                setResponse(response.data);
                console.log("Governor:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching Governor:", error);
            });
    }, []);

    return (
        <>
            <div>
                <Navbar />
                <h1>Governor Profile Page</h1>
                <h2>Welcome {response && response.username}!</h2>
            </div>
        </>
    );
};
export default GovernorProfilePage;
