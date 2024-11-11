import React, { createContext, useState, useContext } from "react";
import { useCallback } from "react";
const HeaderContext = createContext();
import { getExchangeRates } from "../../api/currency";
import { useEffect } from "react";
export const HeaderProvider = ({ children }) => {
    const [headerData, setHeaderDataState] = useState({
        imageSrc: null,
        text: null,
        SearchBarComponent: null,
        ProfilePictureComponent: null,
    });
    const setHeaderData = useCallback((data) => {
        setHeaderDataState(data);
    }, []);

    const [currencyRates, setCurrencyRates] = useState({});
    useEffect(() => {
        getExchangeRates().then((rates) => {
            setCurrencyRates(rates);
        });
    }, []);

    const clearHeader = useCallback(() => {
        setHeaderDataState({
            imageSrc: null,
            text: "",
            SearchBarComponent: null,
            ProfilePictureComponent: null,
        });
    }, []);

    return (
        <HeaderContext.Provider
            value={{
                headerData,
                setHeaderData,
                clearHeader,
                currencyRates,
                setCurrencyRates,
            }}
        >
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => useContext(HeaderContext);
