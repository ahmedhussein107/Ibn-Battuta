import React from "react";
import { Select, MenuItem, CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../hooks/currencyHooks";

const CurrencyDropdown = ({ selectedCurrency, setSelectedCurrency }) => {
    const { rates, isLoading, error } = useCurrencyConverter();

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>Error loading currencies.</div>;
    }

    return (
        <Select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            style={{
                width: "100%", // Adjust the width to fit your layout
                maxWidth: "300px", // Optional: Set a max width
                padding: "0.5rem",
            }}
        >
            <MenuItem value="">Select a currency</MenuItem>
            {rates &&
                Object.keys(rates).map((currency) => (
                    <MenuItem key={currency} value={currency}>
                        {currency}
                    </MenuItem>
                ))}
        </Select>
    );
};

export default CurrencyDropdown;
