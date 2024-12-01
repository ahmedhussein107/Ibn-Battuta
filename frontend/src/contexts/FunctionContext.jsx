import React, { createContext, useContext, useState } from "react";

const FunctionContext = createContext();

export const FunctionProvider = ({ children }) => {
    const [handlePaymentSuccess, setHandlePaymentSuccess] = useState(async () => {
        console.log("success");
    });
    const [handlePaymentFailure, setHandlePaymentFailure] = useState(async () => {
        console.log("failure");
    });

    const setSuccess = (func) => {
        setHandlePaymentSuccess(() => func);
    };
    const setFailure = (func) => {
        setHandlePaymentFailure(() => func);
    };

    return (
        <FunctionContext.Provider
            value={{
                handlePaymentSuccess,
                setSuccess,
                handlePaymentFailure,
                setFailure,
            }}
        >
            {children}
        </FunctionContext.Provider>
    );
};

export const useFunctionContext = () => useContext(FunctionContext);
