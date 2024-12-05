import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";
// Import the discount badge image
import discountBadge from "/discountBadge.png"; // Replace with the correct path to your badge image
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../hooks/currencyHooks";
const DiscountCard = ({
    onClick,
    availableSeats,
    price,
    discountPercentage,
    width,
    height,
}) => {
    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);
    if (isLoading) {
        return <CircularProgress />;
    }
    // Calculate discounted price
    const discountedPrice =
        discountPercentage > 0 ? price - (price * discountPercentage) / 100 : price;

    return (
        <div style={{ ...styles.container, width, height }}>
            <div style={styles.availableSeats}>{availableSeats} Available Seats</div>

            <div style={styles.pricing}>
                {/* Conditionally render price display based on discount */}
                {discountPercentage > 0 ? (
                    <>
                        <div style={styles.originalPrice}>{formatPrice(price)}</div>
                        <div style={styles.discountedPrice}>
                            {formatPrice(discountedPrice)}
                        </div>
                    </>
                ) : (
                    <div style={styles.noDiscountPrice}>{formatPrice(price)}</div>
                )}
            </div>

            <Button
                stylingMode="always-dark"
                text="Book Now"
                customStyle={{
                    maxHeight: "40px",
                    borderRadius: "80px",
                    padding: "10px",
                    width: "35%",
                    marginLeft: "60%",
                }}
                handleClick={onClick}
            />

            {/* Conditionally render the discount badge if there's a discount */}
            {discountPercentage > 0 && (
                <div style={styles.discountBadgeContainer}>
                    <img
                        src={discountBadge}
                        alt="Discount Badge"
                        style={styles.discountBadge}
                    />
                    <div style={styles.discountText}>Discount {discountPercentage}%</div>
                </div>
            )}
        </div>
    );
};

// Define component styles
const styles = {
    container: {
        position: "relative",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
        textAlign: "center",
    },
    availableSeats: {
        color: "green",
        fontSize: "16px",
        marginBottom: "10px",
    },
    pricing: {
        marginBottom: "15px",
    },
    originalPrice: {
        color: "red",
        fontSize: "1.5em",
        textDecoration: "line-through",
        paddingLeft: "60%",
        fontFamily: "Inria Sans",
    },
    discountedPrice: {
        color: "black",
        fontSize: "1.7em",
        fontFamily: "Inria Sans",
        paddingLeft: "60%",
    },
    noDiscountPrice: {
        color: "black",
        fontSize: "24px",
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#ff6b00",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        padding: "10px 20px",
        cursor: "pointer",
        fontSize: "16px",
    },
    discountBadgeContainer: {
        position: "absolute",
        bottom: "-10px",
        left: "8%",
        width: "80px",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    discountBadge: {
        position: "absolute",
        width: "12vw",
        height: "18vh",
    },
    discountText: {
        position: "absolute",
        fontFamily: "Abril Fatface",
        fontSize: "1.3em",
        fontWeight: "bold",
        color: "#1F3230",
        textAlign: "center",
    },
};

// Define prop types
DiscountCard.propTypes = {
    availableSeats: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    discountPercentage: PropTypes.number.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
};

export default DiscountCard;
