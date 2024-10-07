import React, { useState } from "react";
import InputForm from "../components/Form";
import { Button, Box, MenuItem, TextField } from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const AllSignUpPage = () => {
    const [data, setData] = useState({
        username: "",
        name: "",
        password: "",
        email: "",
    });
    const [type, setType] = useState(null);
    const [response, setResponse] = useState(null);

    const handleClick = (e) => {
        const route =
            type === "Advertiser"
                ? "advertiser/createAdvertiser"
                : type === "TourGuide"
                ? "tourguide/createTourGuide"
                : "seller/createSeller";
        e.preventDefault();
        console.log(data);
        axiosInstance
            .post(route, data)
            .then((response) => {
                console.log(response);
                setResponse("Created Successfully");
            })
            .catch((error) => {
                console.log(error);
                setResponse("error");
            });
    };
    return (
        <>
            <h2>Welcome to Our Website</h2>
            <InputForm data={data} setData={setData} />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    marginBottom: "5vh",
                }}
            >
                <TextField value={type} select onChange={(e) => setType(e.target.value)}>
                    <MenuItem value={"TourGuide"}>Tour Guide</MenuItem>
                    <MenuItem value={"Advertiser"}>Advertiser</MenuItem>
                    <MenuItem value={"Seller"}>Seller</MenuItem>
                </TextField>
                <Button variant="contained" onClick={handleClick}>
                    Sign Up
                </Button>
            </Box>
            {response && <p>{response}</p>}
        </>
    );
};

export default AllSignUpPage;
