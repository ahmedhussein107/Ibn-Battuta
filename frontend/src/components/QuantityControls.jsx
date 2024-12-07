import React, { useState, useEffect } from "react";
const QuantityControls = ({ selectedQuantity, setSelectedQuantity, mode = 1 }) => {
    const handleQuantityChange = (change) => {
        setSelectedQuantity(Math.max(1, selectedQuantity + change));
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value, 10) || 1;
        setSelectedQuantity(Math.max(1, value));
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1em",
                minHeight: "5em",
                marginBottom: "1.5em",
            }}
        >
            {mode == 1 && (
                <label
                    style={{
                        display: "block",
                        fontSize: "1.1em",
                        fontWeight: "500",
                        marginBottom: "0.5em",
                    }}
                >
                    Quantity
                </label>
            )}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    style={{
                        backgroundColor: "#ECD1B4",
                        color: "#fff",
                        padding: "0.5rem",
                        fontSize: "1.2rem",
                        border: "none",
                        minWidth: "1.5em",
                        borderRadius: "0.3em",
                        cursor: "pointer",
                    }}
                >
                    -
                </button>

                <input
                    type="number"
                    value={selectedQuantity}
                    onChange={handleInputChange}
                    style={{
                        width: "3em",
                        textAlign: "center",
                        fontSize: "1.2em",
                        fontWeight: "bold",
                        border: "none",
                        outline: "none",
                        backgroundColor: "transparent",
                    }}
                    min="1"
                />

                <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    style={{
                        backgroundColor: "#ECD1B4",
                        color: "#fff",
                        padding: "0.5rem",
                        fontSize: "1.2rem",
                        border: "none",
                        minWidth: "1.5em",
                        borderRadius: "0.3em",
                        cursor: "pointer",
                    }}
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default QuantityControls;
