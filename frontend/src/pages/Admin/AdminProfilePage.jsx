/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";

const AdminProfilePage = () => {
    const [response, setResponse] = useState(null);

    useEffect(() => {
        axiosInstance
            .get("/admin/getAdminById", { withCredentials: true })
            .then((response) => {
                setResponse(response.data);
                console.log("Admin:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching Admin:", error);
            });
    }, []);

    return (
        <>
            <div>
                <Navbar />
                <h1>Admin Profile Page</h1>
                <h2>Welcome {response && response.username}!</h2>
            </div>
        </>
    );
};
export default AdminProfilePage;
