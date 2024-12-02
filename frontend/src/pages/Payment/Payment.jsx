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
        <div style={{ width: "80%" }}>
            <div
                style={{
                    width: "100vw",
                    height: "30vh",
                    backgroundImage: `url(${headerImage})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    marginLeft: "-10vw",
                }}
            ></div>
            {/* add label*/}
            <div
                style={{
                    position: "absolute",
                    top: "20vh",
                    left: "42vw",
                    fontSize: "4rem",
                    color: "white",
                    pointerEvents: "none",
                    fontFamily: "inter",
                    fontWeight: "502",
                    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                }}
            >
                Payment
            </div>

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
