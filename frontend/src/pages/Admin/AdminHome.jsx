import React from "react";
import NavBar from "../../components/NavBar";
import HomePage from "../HomePage";
import Footer from "../../components/Footer";

const AdminHome = () => {
    return (
        <>
            <NavBar />
            <h1>Admin Home</h1>
            <HomePage />
            <Footer />
        </>
    );
};

export default AdminHome;
