import React, { useState } from "react";
import { Checkbox, FormControlLabel, Button, Box } from "@mui/material";

const CheckboxList = ({ items, checkedItems, setCheckedItems }) => {
    const [showAll, setShowAll] = useState(false);

    // Toggle the display of all items or just the first 3
    const toggleShowAll = () => {
        setShowAll((prev) => !prev);
    };

    // Handle changes in checkbox selection
    const handleCheckboxChange = (item) => {
        setCheckedItems(
            (prev) =>
                prev.includes(item)
                    ? prev.filter((i) => i !== item) // Remove if already checked
                    : [...prev, item] // Add if not checked
        );
    };

    // Determine which items to display based on showAll state
    const displayedItems = showAll ? items : items.slice(0, 3);

    return (
        <Box
            sx={{
                padding: 2,
                backgroundColor: "#f3f6f9", // Light blue background color
                borderRadius: "2vh",
                width: "90%",
            }}
        >
            {displayedItems.map((item) => (
                <FormControlLabel
                    key={item}
                    control={
                        <Checkbox
                            checked={checkedItems.includes(item)}
                            onChange={() => handleCheckboxChange(item)}
                        />
                    }
                    label={item}
                />
            ))}

            <Button
                onClick={toggleShowAll}
                size="small"
                sx={{ mt: 1, textTransform: "none", color: "black" }}
                endIcon={<span>{showAll ? "▲" : "▼"}</span>}
            >
                {showAll ? "show less" : "show all"}
            </Button>
        </Box>
    );
};

export default CheckboxList;
