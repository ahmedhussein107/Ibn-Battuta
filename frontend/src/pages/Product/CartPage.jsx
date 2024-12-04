import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

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
        <div>
            <button onClick={handleCheckoutClick}>checkout</button>
        </div>
    );
};

export default CartPage;
