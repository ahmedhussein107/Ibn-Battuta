import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";

import axiosInstance from "../api/axiosInstance";
import Cookies from "js-cookie";
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Payment Form Component
const PaymentForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Create PaymentIntent when the page loads
        // fetch("/api/create-payment-intent", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ amount: amount }),
        // })
        //     .then((res) => res.json())
        //     .then((data) => setClientSecret(data.clientSecret));
        const currency = Cookies.get("currency") || "EGP";
        console.log("currency", currency);
        const createPayment = async () => {
            const response = await axiosInstance.post("payment/create-payment-intent", {
                amount,
                currency,
            });
            setClientSecret(response.data.clientSecret);
        };
        createPayment();
    }, [amount]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            return;
        }

        const email = Cookies.get("email");

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    // You can collect and add billing details here
                    name: "Test User",
                    email,
                },
            },
        });

        console.log("result", result);

        if (result.error) {
            setError(`Payment failed: ${result.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: "100%", height: "auto" }}>
            <div className="form-row">
                <CardElement
                    options={{
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
                    }}
                />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={processing || !stripe || succeeded}>
                {processing ? "Processing..." : "Pay Now"}
            </button>
            {succeeded && <div>Payment successful!</div>}
        </form>
    );
};

// Wrapper component that provides Stripe context
const StripeWrapper = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm amount={100} />
        </Elements>
    );
};

export default StripeWrapper;
