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
    const [isWalletUsed, setIsWalletUsed] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [promoCodes, setPromoCodes] = useState([]);
    const [buttonText, setButtonText] = useState("Pay with Card");
    const [discounts, setDiscounts] = useState([]); // {title, discount}
    const [err, setErr] = useState(null);

    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);

    const navigate = useNavigate();
    const { setSuccess, setFailure } = useFunctionContext();

    const originalPrice = items.reduce((acc, item) => acc + item.price, 0);
    const [totalPrice, setTotalPrice] = useState(originalPrice);

    const [amountFromWallet, setAmountFromWallet] = useState(0);

    useEffect(() => {
        const onMount = async () => {
            console.log("in onMount");
            await handleOnMount();
            console.log("after handleOnMount");
        };

        if (!isOpen) {
            setErr(null);
            setButtonText("Pay with Card");
            setIsWalletUsed(false);
            setPromoCode("");
            setPromoCodes([]);
            setDiscounts([]);
            setTotalPrice(originalPrice);
            setAmountFromWallet(0);
            return;
        }

        try {
            onMount();
        } catch (error) {
            console.log(error);
            setErr(error.message);
        }
    }, [isOpen]);

    useEffect(() => {
        let newTotalPrice = totalPrice;
        if (isWalletUsed) {
            const wallet = Math.min(totalPrice, Number(Cookies.get("balance")));
            setAmountFromWallet(wallet);
            newTotalPrice = totalPrice - wallet;
        } else {
            setAmountFromWallet(0);
        }
        setButtonText(newTotalPrice !== 0 ? "Pay with Card" : "Pay with Wallet");
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
            const newTotalPrice =
                totalPrice - (totalPrice * promoCodeDetails.discount) / 100;
            if (isWalletUsed)
                setAmountFromWallet(
                    Math.min(newTotalPrice, Number(Cookies.get("balance")))
                );
            setTotalPrice(newTotalPrice);
            setPromoCodes((prev) => [...prev, promoCode]);
        } catch (error) {
            setErr(error.response.data.message);
        }
    };

    const handleSubmit = async () => {
        setErr(null);
        const handleSuccess = async () => {
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
            navigate(successDirectUrl, {
                state: { ...state, hotel: JSON.parse(localStorage.getItem("hotel")) },
            });
        };
        // check the payment type
        // 1- wallet only
        // a) complete the payment
        // b) show success message
        if (totalPrice === 0) {
            try {
                await handleSuccess();
            } catch (error) {
                setErr(error.message);
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
        console.log("handleClose");
        if (localStorage.getItem("success") === "true") {
            localStorage.removeItem("success");
        } else {
            console.log("handleOnFailure");
            await handleOnFailure();
            console.log("handleOnFailure done");
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
                    <label>Promo Code: </label>
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
                            text={"Apply"}
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
                                Price Details
                            </p>
                        </div>
                        <div style={{ width: "100%", backgroundColor: "white" }}>
                            <div
                                style={{
                                    width: "100%",
                                    margin: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            width: "90%",
                                            display: "flex",
                                            justifyContent: "space-between",
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
                                            width: "90%",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            color: "red",
                                        }}
                                    >
                                        <p>{discount.title}</p>
                                        <p> - {formatPrice(discount.discount)}</p>
                                    </div>
                                ))}
                                {amountFromWallet > 0 && (
                                    <div
                                        key={"wallet"}
                                        style={{
                                            width: "90%",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            color: "red",
                                        }}
                                    >
                                        <p>Wallet</p>
                                        <p> - {formatPrice(amountFromWallet)}</p>
                                    </div>
                                )}
                                <hr style={{ width: "100%" }} />
                                <div
                                    style={{
                                        width: "90%",
                                        backgroundColor: "white",
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <p style={{ fontWeight: "bold" }}>Total:</p>
                                    <p>{formatPrice(totalPrice - amountFromWallet)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {err && <Alert severity="error">{err}</Alert>}
                </div>
            </PopUp>
        </div>
    );
};

export default CheckoutPopup;
