import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useFunctionContext } from "../../contexts/FunctionContext";
import usePageHeader from "../../components/Header/UseHeaderPage";
import background from "../../assets/backgrounds/shopBackground.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const CartPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    usePageHeader(background, "Cart", null, null);

    useEffect(() => {
        axiosInstance.get("/cart/getCart", { withCredentials: true }).then((response) => {
            setCart(response.data);
            console.log(response.data);
        });
    }, []);

    const handleCheckoutClick = async () => {
        navigate("/checkout");
    };

    return (
        <div
            style={{ display: "flex", flexDirection: "row", alignItems: "space-between" }}
        >
            <div style={{ display: "flex", flexDirection: "row" }}>
                <button style={buttonStyle} onClick={() => navigate("/shop")}>
                    <ShoppingBagIcon
                        style={{
                            width: "1rem",
                            height: "1rem",
                            color: "#9C4F21",
                            scale: "1.5",
                        }}
                    />
                    <span
                        style={{
                            fontSize: "1.3rem",
                            color: "#9C4F21",
                        }}
                    >
                        Shop
                    </span>
                </button>
                <button style={buttonStyle} onClick={() => navigate("/shop")}>
                    <FavoriteBorderIcon
                        style={{
                            width: "1rem",
                            height: "1rem",
                            color: "#9C4F21",
                            scale: "1.5",
                        }}
                    />
                    <span
                        style={{
                            fontSize: "1.3rem",
                            color: "#9C4F21",
                        }}
                    >
                        wishlist
                    </span>
                </button>
            </div>
            <button
                style={{
                    ...selectedButtonStyle,
                    marginLeft: "62%",
                }}
            >
                <ShoppingCartIcon
                    style={{
                        width: "1rem",
                        height: "1rem",
                        color: "#9C4F21",
                        scale: "1.5",
                    }}
                />
                <span
                    style={{
                        fontSize: "1.3rem",
                        color: "#9C4F21",
                    }}
                >
                    Cart
                </span>
            </button>
            <button onClick={() => navigate("/tourist/checkout")}>checkout</button>
        </div>
    );
};

const buttonStyle = {
    border: "2px solid #9C4F21",
    borderRadius: "50px",
    padding: "0.5em 1.1em",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    backgroundColor: "white",
    display: "flex", // Add this
    alignItems: "center", // Add this
    gap: "0.4rem", // Add this to create space between icon and text
    transition: "background-color 0.3s ease, color 0.3s ease",
};

const selectedButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#FAE2B6",
    color: "#9C4F21",
};

export default CartPage;
