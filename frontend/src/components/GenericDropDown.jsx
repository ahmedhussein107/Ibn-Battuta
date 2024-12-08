import React from "react";
import { Select, MenuItem, CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../hooks/currencyHooks";

const GenericDropDown = ({
    options,
    selectedItem,
    setSelectedItem,
    label = "currency",
}) => {
    const placeholder = `Select a ${label}`;

    return (
        <Select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            displayEmpty
            style={{
                width: "100%", // Adjust the width to fit your layout
                height: "3rem", // Adjust the height to fit your layout
                maxWidth: "400px", // Optional: Set a max width
                padding: "0.5rem",
            }}
            renderValue={(value) => (value ? value : placeholder)} // Placeholder display logic
        >
            <MenuItem value="" disabled>
                {placeholder}
            </MenuItem>
            {options &&
                Object.keys(options).map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
        </Select>
    );
};

export default GenericDropDown;
