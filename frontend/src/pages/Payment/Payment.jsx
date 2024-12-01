import React from "react";
import usePageHeader from "../../components/Header/UseHeaderPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../../components/PaymentForm";
import { useLocation } from "react-router-dom";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
    const location = useLocation();
    if (!location.state) {
        window.location.back();
    }
    const { amount, currency, handleSuccess, handleFailure, headerImage } =
        location.state;

    usePageHeader(headerImage, "Payment", null, null);
    return (
        <div style={{ marginTop: "18%", width: "80%" }}>
            <Elements stripe={stripePromise}>
                <PaymentForm
                    amount={amount}
                    currency={currency}
                    handleSuccess={handleSuccess}
                    handleFailure={handleFailure}
                />
            </Elements>
        </div>
    );
};

export default Payment;
