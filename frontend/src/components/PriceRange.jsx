import React from "react";

const PriceRange = ({ priceRange, setPriceRange }) => {
    const handleInputChange = (index, value) => {
        const parsedValue =
            value === "" ? "" : parseInt(value, 10) || (index == 0 ? 0 : 100000000);
        const updatedRange = [...priceRange];
        updatedRange[index] = parsedValue;
        setPriceRange(updatedRange);
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#FCF3E2",
                maxWidth: "300px",
                margin: "auto",
            }}
        >
            <input
                type="number"
                value={priceRange[0] === "" ? "" : priceRange[0]}
                onChange={(e) => handleInputChange(0, e.target.value)}
                style={{
                    width: "100px",
                    padding: "5px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    textAlign: "center",
                }}
                placeholder="Min Price"
            />
            <span style={{ fontWeight: "bold", color: "#666" }}>to</span>
            <input
                type="number"
                value={priceRange[1] === "" ? "" : priceRange[1]}
                onChange={(e) => handleInputChange(1, e.target.value)}
                style={{
                    width: "100px",
                    padding: "5px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    textAlign: "center",
                }}
                placeholder="Max Price"
            />
        </div>
    );
};

export default PriceRange;
