import React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const PriceRange = ({ priceRange, setPriceRange, min, max }) => {
    const marks = [
        { value: min, label: min },
        { value: max, label: max },
    ];

    const handleChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    return (
        <Box sx={{ width: "90%", marginLeft: "5%" }}>
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
