import React, { useState } from "react";
import InputForm from "../components/Form";
import { Button, Box, MenuItem, TextField } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { uploadFiles } from "../api/firebase";

const AllSignUpPage = () => {
    const [data, setData] = useState({
        username: "",
        name: "",
        password: "",
        email: "",
    });
    const [type, setType] = useState("");
    const [response, setResponse] = useState("");
    const [files, setFiles] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        console.log("Selected files:", selectedFiles);
        setFiles(selectedFiles);
    };

    const handleClick = async (e) => {
        const route =
            type === "Advertiser"
                ? "advertiser/createAdvertiser"
                : type === "TourGuide"
                ? "tourguide/createTourGuide"
                : "seller/createSeller";
        e.preventDefault();
        const documents = await uploadFiles(files, "documents");
        console.log("Data to be sent: ", { ...data, documents });
        try {
            const response = await axiosInstance.post(route, {
                ...data,
                documents,
            });
            console.log(response);
            setResponse("Created Successfully");
        } catch (error) {
            console.log(error);
            setResponse("error");
        }
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
                <TextField
                    value={type}
                    select
                    onChange={(e) => setType(e.target.value)}
                >
                    <MenuItem value={"TourGuide"}>Tour Guide</MenuItem>
                    <MenuItem value={"Advertiser"}>Advertiser</MenuItem>
                    <MenuItem value={"Seller"}>Seller</MenuItem>
                </TextField>
                {/* Hidden File Input */}
                <input
                    type="file"
                    id="upload-button-file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />

                {/* Button to Trigger File Input */}
                <label htmlFor="upload-button-file">
                    <Button variant="contained" component="span">
                        Upload File
                    </Button>
                </label>
                <Button variant="contained" onClick={handleClick}>
                    Sign Up
                </Button>
            </Box>
            {response && <p>{response}</p>}
        </>
    );
};

export default AllSignUpPage;
