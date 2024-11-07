import React, { createContext, useState, useContext } from "react";

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [headerData, setHeaderData] = useState({
        imageSrc: "",
        text: "",
    });

    return (
        <HeaderContext.Provider value={{ headerData, setHeaderData }}>
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => useContext(HeaderContext);
