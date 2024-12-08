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
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
                style={{
                    width: "100vw",
                    height: "40vh",
                    backgroundImage: `url(${headerImage})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    color: "white",
                    pointerEvents: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <p
                    style={{
                        marginTop: "10%",
                        fontSize: "3.2rem",
                        fontFamily: "inter",
                        fontWeight: "bold",
                        textShadow: "4px 4px 8px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    Payment
                </p>
            </div>

            <div style={{ width: "80%" }}>
                <Elements stripe={stripePromise}>
                    <PaymentForm
                        amount={amount}
                        currency={currency}
                        handleSuccess={handlePaymentSuccess}
                        handleFailure={handlePaymentFailure}
                    />
                </Elements>
            </div>
        </div>
    );
};

export default Payment;
