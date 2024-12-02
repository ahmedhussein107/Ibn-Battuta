import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate("/checkout")}>checkout</button>
        </div>
    );
};

export default CartPage;
