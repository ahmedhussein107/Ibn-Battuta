import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useFunctionContext } from "../../contexts/FunctionContext";

const CartPage = () => {
    const navigate = useNavigate();
    const { setSuccess, setFailure } = useFunctionContext();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        axiosInstance.get("/cart/getCart", { withCredentials: true }).then((response) => {
            setCart(response.data);
            console.log(response.data);
        });
    }, []);

    const handleCheckoutClick = async () => {
        try {
            const response = await axiosInstance.post(
                "/order/createOrder",
                {},
                {
                    withCredentials: true,
                }
            );
            const handleFailure = async () => {
                await axiosInstance.delete(`order/deleteOrder/${response.data._id}`);
            };
            setFailure(handleFailure);

            navigate("/checkout", { state: { order: response.data } });
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div>
            <button onClick={handleCheckoutClick}>checkout</button>
        </div>
    );
};

export default CartPage;
