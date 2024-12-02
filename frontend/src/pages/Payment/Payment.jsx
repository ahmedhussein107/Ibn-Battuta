import React from "react";
import usePageHeader from "../../components/Header/UseHeaderPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../../components/PaymentForm";
import { useLocation } from "react-router-dom";
import { useFunctionContext } from "../../contexts/FunctionContext";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
    const location = useLocation();

    if (!location.state) {
        window.history.back();
    }

    const { amount, currency, headerImage } = location.state;

    const { handlePaymentSuccess, handlePaymentFailure } = useFunctionContext();
    usePageHeader(headerImage, "Payment", null, null);
    return (
        <div style={{ marginTop: "20%", width: "80%" }}>
            <Elements stripe={stripePromise}>
                <PaymentForm
                    amount={amount}
                    currency={currency}
                    handleSuccess={handlePaymentSuccess}
                    handleFailure={handlePaymentFailure}
                />
            </Elements>
        </div>
    );
};

export default Payment;
