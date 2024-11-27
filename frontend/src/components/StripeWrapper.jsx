import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";

import axiosInstance from "../api/axiosInstance";
import Cookies from "js-cookie";
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Styled Components
const FormContainer = styled.div`
    width: 90%;
    max-width: 400px;
    margin: 5% auto;
    padding: 5%;
    background-color: #f9f9f9;
    border-radius: 1rem;
    box-shadow: 0 2vw 4vw rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
    font-size: 1.8rem;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const StyledButton = styled.button`
    background-color: #6772e5;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    padding: 0.8rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #5469d4;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const InputField = styled.input`
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: #6772e5;
        box-shadow: 0 0 0 0.3rem rgba(103, 114, 229, 0.2);
    }
`;

const ErrorMessage = styled.div`
    color: #d9534f;
    font-size: 1rem;
    text-align: center;
`;

const SuccessMessage = styled.div`
    color: #28a745;
    font-size: 1rem;
    text-align: center;
`;

// Payment Form Component
const PaymentForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const currency = Cookies.get("currency") || "USD";

        const createPayment = async () => {
            const response = await axiosInstance.post("payment/create-payment-intent", {
                amount,
                currency,
            });
            console.log("payment Intent created: ", response);
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

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
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
        <FormContainer>
            <Title>Payment</Title>
            <StyledForm onSubmit={handleSubmit}>
                <InputField
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "1rem",
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
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <StyledButton type="submit" disabled={processing || !stripe || succeeded}>
                    {processing ? "Processing..." : `Pay $${amount}`}
                </StyledButton>
                {succeeded && <SuccessMessage>Payment successful!</SuccessMessage>}
            </StyledForm>
        </FormContainer>
    );
};

// Wrapper component that provides Stripe context
const StripeWrapper = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm amount={1000} />
        </Elements>
    );
};

export default StripeWrapper;
