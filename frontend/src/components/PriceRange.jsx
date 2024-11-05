import React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const marks = [
    { value: 0, label: "0" },
    { value: 1000, label: "1000" },
];

const PriceRange = ({ priceRange, setPriceRange, min, max }) => {
    const handleChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Slider
                value={priceRange}
                onChange={handleChange}
                marks={marks}
                min={min}
                max={max}
                valueLabelDisplay="auto"
            />
        </Box>
    );
};

export default PriceRange;
