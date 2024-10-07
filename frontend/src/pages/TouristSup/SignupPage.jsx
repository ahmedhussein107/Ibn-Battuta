import React, { useState } from "react";
import { TextField, Button, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import MenuItem from "@mui/material/MenuItem";
import MapComponent from "../../components/MapComponent";
const SignupPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        mobile: "",
        nationality: "",
        DOB: "",
        job: "",
        name: "",
    });
    const [response, setResponse] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance
            .post("/tourist/createTourist", formData)
            .then((response) => {
                console.log("Created Successfully");
                setResponse("Created Successfully");
            })
            .catch((error) => {
                console.log(error);
                setResponse("error");
            });

        console.log("Form submitted:", formData);
    };

    return <MapComponent />;
};

export default SignupPage;
