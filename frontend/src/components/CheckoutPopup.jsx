import React, { useState, useEffect } from "react";
import PopUp from "./PopUpsGeneric/PopUp";
import { MySwitch } from "./Switch";
import { useCurrencyConverter } from "../hooks/currencyHooks";
import { TextField, Alert } from "@mui/material";
import Button from "./Button";
import Cookies from "js-cookie";
import axiosInstance from "../api/axiosInstance";
import "../styles/themes.css";
import { useNavigate } from "react-router-dom";
import { useFunctionContext } from "../contexts/FunctionContext";

const CheckoutPopup = ({
    handleOnMount = async () => {},
    handleOnSuccess,
    handleOnFailure,
    isOpen,
    setIsOpen,
    items, // array of objects {title, price}
    successDirectUrl,
    state,
    headerImage,
}) => {
    useEffect(() => {
        const onMount = async () => {
            await handleOnMount();
        };

        try {
            onMount();
        } catch (error) {
            console.log(error);
            setErr(error.message);
        }
    }, []);

    const [isWalletUsed, setIsWalletUsed] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [promoCodes, setPromoCodes] = useState([]);
    const [buttonText, setButtonText] = useState("pay with card");
    const [discounts, setDiscounts] = useState([]); // {title, discount}
    const [err, setErr] = useState(null);

    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);

    const navigate = useNavigate();
    const { setSuccess, setFailure } = useFunctionContext();

    const originalPrice = items.reduce((acc, item) => acc + item.price, 0);
    const [totalPrice, setTotalPrice] = useState(originalPrice);

    useEffect(() => {
        if (isWalletUsed) {
            let newDiscounts = [...discounts];
            newDiscounts.push({
                title: "wallet",
                discount: Math.min(Cookies.get("balance"), totalPrice),
            });
            setDiscounts(newDiscounts);
            const newTotalPrice =
                items.reduce((acc, item) => acc + item.price, 0) -
                newDiscounts.reduce((acc, item) => acc + item.discount, 0);
            setTotalPrice(newTotalPrice);
            if (newTotalPrice === 0) {
                setButtonText("pay with wallet");
            } else {
                setButtonText("pay with card");
            }
        } else {
            let newDiscounts = discounts.filter(
                (discount) => discount.title !== "wallet"
            );
            setDiscounts(newDiscounts);
            const newTotalPrice =
                items.reduce((acc, item) => acc + item.price, 0) -
                newDiscounts.reduce((acc, item) => acc + item.discount, 0);
            setTotalPrice(newTotalPrice);
            if (newTotalPrice === 0) {
                setButtonText("pay with wallet");
            } else {
                setButtonText("pay with card");
            }
        }
    }, [isWalletUsed]);

    const applyPromoCode = async () => {
        try {
            setErr(null);
            if (promoCodes.includes(promoCode)) {
                setErr("promo code already applied");
                return;
            }
            const response = await axiosInstance.post(
                "/promocode/validatePromoCode",
                {
                    promoCodeId: promoCode,
                },
                { withCredentials: true }
            );
            const { message, promoCodeDetails } = response.data;
            setDiscounts((prev) => [
                ...prev,
                {
                    title: promoCode,
                    discount: (totalPrice * promoCodeDetails.discount) / 100,
                },
            ]);
            setTotalPrice((prev) => prev - prev * (promoCodeDetails.discount / 100));
            setPromoCodes((prev) => [...prev, promoCode]);
        } catch (error) {
            setErr(error.response.data.message);
        }
    };

    const handleSubmit = async () => {
        setErr(null);
        const handleSuccess = async () => {
            const amountFromWallet =
                discounts.find((discount) => discount.title === "wallet")?.discount || 0;
            await handleOnSuccess(amountFromWallet);
            const promoCodesPromises = promoCodes.map(async (promoCode) => {
                await axiosInstance.post(
                    "/promocode/applyPromoCode",
                    {
                        promoCodeId: promoCode,
                        totalAmount: totalPrice,
                    },
                    { withCredentials: true }
                );
            });
            await Promise.all(promoCodesPromises);
            localStorage.setItem("success", "true");
            navigate(successDirectUrl, { state });
        };
        // check the payment type
        // 1- wallet only
        // a) complete the payment
        // b) show success message
        if (totalPrice === 0) {
            try {
                await handleSuccess();
            } catch (error) {
                setErr(error);
            }
        }
        // 2- card only
        // a) complete the payment
        // b) show success message
        // 3- wallet + card
        // a) complete the payment
        // b) show success message
        else {
            setSuccess(handleSuccess);
            setFailure(handleOnFailure);
            navigate("/tourist/payment", {
                state: {
                    amount: totalPrice,
                    currency,
                    headerImage,
                },
            });
        }
    };

    const handleClose = async () => {
        if (localStorage.getItem("success") === "true") {
            localStorage.removeItem("success");
        } else {
            await handleOnFailure();
        }
        setIsOpen(false);
    };

    return (
        <div style={{ width: "100vw" }}>
            <PopUp
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                headerText="Checkout"
                actionText={buttonText}
                handleSubmit={handleSubmit}
                handleOnClose={handleClose}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <MySwitch
                        label="Use Wallet Balance"
                        value={isWalletUsed}
                        setValue={setIsWalletUsed}
                    />
                    <p>Balance: {formatPrice(Cookies.get("balance"))}</p>
                    <label>promo code: </label>
                    <div style={{ display: "flex", width: "100%", gap: "1rem" }}>
                        <TextField
                            id="outlined-basic"
                            label="promo code"
                            variant="outlined"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button
                            stylingMode="always-dark"
                            text={"apply"}
                            handleClick={applyPromoCode}
                            width="30%"
                            customStyle={{
                                textAlign: "center",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            borderRadius: "10px",
                            border: "1px solid #ccc",
                            backgroundColor: "var(--accent-color)",
                            marginTop: "2%",
                        }}
                    >
                        {/** price details */}
                        <div style={{ width: "100%" }}>
                            <p
                                style={{
                                    fontSize: "1.2rem",
                                    color: "white",
                                    padding: "10px",
                                }}
                            >
                                price details
                            </p>
                        </div>
                        <div style={{ width: "100%", backgroundColor: "white" }}>
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                    }}
                                >
                                    <p>{item.title}</p>
                                    <p>{formatPrice(item.price)}</p>
                                </div>
                            ))}
                            {discounts.map((discount, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                        color: "red",
                                    }}
                                >
                                    <p>{discount.title}</p>
                                    <p> - {formatPrice(discount.discount)}</p>
                                </div>
                            ))}
                        </div>
                        <hr style={{ width: "100%" }} />
                        <div
                            style={{
                                width: "100%",
                                backgroundColor: "white",
                                display: "flex",
                                justifyContent: "space-around",
                            }}
                        >
                            <p style={{ fontWeight: "bold" }}>total:</p>
                            <p>{formatPrice(totalPrice)}</p>
                        </div>
                    </div>
                    {err && <Alert severity="error">{err}</Alert>}
                </div>
            </PopUp>
        </div>
    );
};

export default CheckoutPopup;
