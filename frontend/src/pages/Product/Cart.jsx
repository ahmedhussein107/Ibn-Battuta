import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import usePageHeader from "../../components/Header/UseHeaderPage";
import background from "../../assets/backgrounds/shopBackground.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Footer from "../../components/Footer";
import CartItem from "../../components/CartItem";
import { useCurrencyConverter } from "../../hooks/currencyHooks.js";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [cartIsLoading, setCartIsLoading] = useState(true);
    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);

    usePageHeader(background, "Cart");

    useEffect(() => {
        const fetchCart = async () => {
            const response = await axiosInstance.get("/cart/getCart", {
                withCredentials: true,
            });
            console.log(response.data);
            setCart(response.data);
            setCartIsLoading(false);
        };
        fetchCart();
    }, []);

    const setProductCount = (index, newCount) => {
        const newCart = [...cart];
        console.log(newCart);
        newCart[index].count = newCount;
        setCart(newCart);
    };

    const deleteProductFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3vh",
                width: "100%",
                marginTop: "20%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "90%",
                }}
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
                            Wishlist
                        </span>
                    </button>
                </div>
                <button style={selectedButtonStyle}>
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
                {/*<button onClick={() => navigate("/tourist/checkout")}>Checkout</button>*/}
            </div>

            <hr style={{ width: "90%", margin: "0 auto" }} />

            {(isLoading || cartIsLoading) && <CircularProgress />}

            {!isLoading && !cartIsLoading && cart.length > 0 && (
                <div
                    style={{
                        width: "90%",
                        height: "80%",
                        backgroundColor: "#FFFAFA",
                        borderRadius: "2vh",
                        paddingTop: "3vh",
                    }}
                >
                    {cart.map((element, index) => (
                        <CartItem
                            product={element.productID}
                            count={element.count}
                            setCount={(newCount) => setProductCount(index, newCount)}
                            onDelete={() => deleteProductFromCart(index)}
                            formatPrice={formatPrice}
                        />
                    ))}
                </div>
            )}

            {!isLoading && !cartIsLoading && cart.length == 0 && (
                <p>Your cart is empty! Go to the shop to add some products</p>
            )}

            <Footer />
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

export default Cart;
