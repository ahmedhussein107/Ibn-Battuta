/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";

const SellerProfilePage = () => {
    const [response, setResponse] = useState(null);

    useEffect(() => {
        axiosInstance
            .get("/seller/getSellerById", { withCredentials: true })
            .then((response) => {
                setResponse(response.data);
                console.log("Seller:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching Seller:", error);
            });
    }, []);

    return (
        <>
            <div>
                <Navbar />
                <h1>Seller Profile Page</h1>
                <h2>Welcome {response && response.username}!</h2>
            </div>
        </>
    );
};
export default SellerProfilePage;
