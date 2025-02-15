import React, { createContext, useState, useContext } from "react";
import { useCallback } from "react";
const HeaderContext = createContext();

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
            }}
        >
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => useContext(HeaderContext);
