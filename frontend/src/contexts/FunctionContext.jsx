import React, { createContext, useContext, useState } from "react";

const FunctionContext = createContext();

export const FunctionProvider = ({ children }) => {
    const [handlePaymentSuccess, setHandlePaymentSuccess] = useState(() => {});
    const [handlePaymentFailure, setHandlePaymentFailure] = useState(() => {});

    return (
        <FunctionContext.Provider
            value={{
                handlePaymentSuccess,
                setHandlePaymentSuccess,
                handlePaymentFailure,
                setHandlePaymentFailure,
            }}
        >
            {children}
        </FunctionContext.Provider>
    );
};

export const useFunctionContext = () => useContext(FunctionContext);
