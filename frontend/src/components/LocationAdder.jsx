import React, { useState } from "react";
import { TextField, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import MapPopUp from "./MapPopUp";

// Custom button component
function MyButton({ text, fontSize = "14px", onClick }) {
    const StyledButton = styled("button")(({ theme }) => ({
        backgroundColor: "#f4e1c1", // Beige color from the screenshot
        color: "#000", // Black text
        border: "2px solid #000",
        borderRadius: "20px",
        padding: "5px 15px",
        fontSize,
        cursor: "pointer",
        textTransform: "none",
        fontWeight: "600",
        "&:hover": {
            backgroundColor: "#e4d0b0", // Slightly darker beige on hover
        },
    }));

    return <StyledButton onClick={onClick}>{text}</StyledButton>;
}

// LocationAdder component
const LocationAdder = ({ title, styles, location, setLocation, setMapFunction }) => {
    const handleAddLocation = () => {
        const mapFunction = (location) => setLocation(location);
        setMapFunction(() => mapFunction);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                ...styles, // Allow overriding styles through props
            }}
        >
            {/* Title */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {title}
                </Typography>
                {/* Add Location Button */}
                <MyButton text="Add location" onClick={handleAddLocation} />
            </Box>

            {/* Read-Only TextField */}
            <TextField
                value={location.location || "No location added"}
                InputProps={{
                    readOnly: true,
                    disabled: true,
                }}
                variant="outlined"
                placeholder="No location added"
            />
        </Box>
    );
};

export default LocationAdder;
