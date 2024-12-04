import React, { useState, useEffect } from "react";

import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Typography, Box, TextField, Grid, CircularProgress, Alert } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import CustomButton from "./Button";
import Cookies from "js-cookie";

const PaymentForm = ({ amount, currency, handleSuccess, handleFailure }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        const success = async () => {
            await handleSuccess();
        };
        if (succeeded) {
            console.log("gowa el nagah el fashel");
            success();
        }
    }, [succeeded]);

    useEffect(() => {
        const createPayment = async () => {
            const response = await axiosInstance.post("payment/create-payment-intent", {
                amount: Math.round(amount * 100) / 100,
                currency,
            });
            console.log("payment Intent created: ", response);
            setClientSecret(response.data.clientSecret);
        };
        createPayment();
        return async () => {
            if (!succeeded) {
                console.log("gowa el fashal");
                await handleFailure();
            }
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            return;
        }

        const email = Cookies.get("email") || "";

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardNumberElement),
                billing_details: {
                    name,
                    email,
                },
            },
        });

        if (result.error) {
            setError(result.error.message);
            setProcessing(false);
            setSucceeded(false);
            console.log("ta7t set succeeded false");
        } else {
            setSucceeded(true);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                    color: "#aab7c4",
                },
            },
            invalid: {
                color: "#9e2146",
            },
        },
    };

    return (
        <>
            <form style={{ marginTop: "5vh", height: "100%" }}>
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ color: "#9C4F21" }}
                    fontSize={"2rem"}
                    style={{ fontWeight: "bold" }}
                    marginLeft={"-6rem"}
                    marginTop={"-2rem"}
                >
                    Delivery and Payment
                </Typography>
                <Box
                    sx={{
                        borderBottom: "1.5px solid #000",
                        width: "117%",
                        marginTop: "1rem",
                        marginLeft: "-6rem",
                    }}
                />
                <Box
                    sx={{
                        backgroundColor: "#9C4F21",
                        padding: "1rem",
                        borderRadius: "0.25rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        marginTop: "2rem",
                        marginLeft: "-1rem",
                        width: "98%",
                        height: "3vh",
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            color: "#fff",
                            fontWeight: "bold",
                            marginBottom: "1rem",
                            width: "20vh",
                        }}
                    >
                        Payment options
                    </Typography>
                </Box>
                <div style={{ marginLeft: "2vw" }}>
                    <Box sx={{ marginTop: "2rem", width: "30vw" }}>
                        <TextField
                            fullWidth
                            label="Name on card"
                            name="name"
                            variant="outlined"
                            required
                            sx={{ marginBottom: "1rem" }}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>

                    <Typography variant="body1" gutterBottom>
                        Card Information
                    </Typography>

                    <Grid container spacing={2} sx={{ marginBottom: "1.5rem" }}>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: "0.25rem",
                                    padding: "0.75rem",
                                    width: "28.5vw",
                                }}
                            >
                                <CardNumberElement options={cardElementOptions} />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: "0.25rem",
                                    padding: "0.75rem",
                                    width: "13vw",
                                }}
                            >
                                <CardExpiryElement options={cardElementOptions} />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: "0.25rem",
                                    padding: "0.75rem",
                                    width: "13vw",
                                    marginLeft: "-23.7vw",
                                }}
                            >
                                <CardCvcElement options={cardElementOptions} />
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ marginBottom: "1rem", width: "30vw" }}>
                        <TextField
                            fullWidth
                            label="Billing Zip Code"
                            name="zip"
                            variant="outlined"
                            required
                        />
                    </Box>
                </div>

                <Box
                    sx={{
                        padding: "1rem",
                        marginBottom: "1.5rem",
                        borderRadius: "0.25rem",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#FCE5B5",
                            padding: "16px",
                            borderRadius: "8px",
                            marginBottom: "16px",
                        }}
                    >
                        <Typography variant="subtitle1" gutterBottom>
                            Important information about your booking:
                        </Typography>
                    </div>
                    <div style={{ marginLeft: "2vw" }}>
                        <ol>
                            <li>This rate is refundable.</li>
                            <li>Stay extensions will require a new reservation.</li>
                            <li>Front desk staff will greet guests on arrival.</li>
                            <li>
                                No refunds will be issued for late check-in or early
                                check-out.
                            </li>
                        </ol>
                    </div>
                    <Typography
                        variant="body2"
                        sx={{
                            marginTop: "1rem",
                            fontSize: "0.875rem",
                            color: "#6c757d", // Muted color for the text
                        }}
                    >
                        By clicking the button below, I acknowledge that I have reviewed
                        the{" "}
                        <a
                            href="/privacy"
                            style={{ color: "#007bff", textDecoration: "none" }}
                        >
                            Privacy Statement
                        </a>{" "}
                        and have reviewed and accept the{" "}
                        <a
                            href="/privacy"
                            style={{ color: "#007bff", textDecoration: "none" }}
                        >
                            Rules and Restrictions
                        </a>{" "}
                        and{" "}
                        <a
                            href="/privacy"
                            style={{ color: "#007bff", textDecoration: "none" }}
                        >
                            Terms of Use
                        </a>
                        .
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" style={{ marginBottom: "1rem" }}>
                        {error}
                    </Alert>
                )}
                {processing && <CircularProgress />}
                {succeeded && (
                    <Alert severity="success" style={{ marginBottom: "1rem" }}>
                        Payment succeeded!
                    </Alert>
                )}
            </form>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0rem",
                    marginBottom: "2rem",
                    position: "relative",
                    zIndex: 10,
                }}
            >
                <CustomButton
                    customStyle={{ width: "10vw" }}
                    stylingMode="2"
                    text="Back"
                    handleClick={() => {
                        window.history.back();
                    }}
                />
                <CustomButton
                    customStyle={{ width: "10vw" }}
                    stylingMode="1"
                    text="Pay"
                    handleClick={handleSubmit}
                />
            </Box>
        </>
    );
};

export default PaymentForm;
