import React, { createContext, useState, useContext } from "react";

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [headerData, setHeaderData] = useState({
        imageSrc: "",
        text: "",
        SearchBarComponent: null,
        ProfilePictureComponent: null,
    });

    return (
        <HeaderContext.Provider value={{ headerData, setHeaderData }}>
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => useContext(HeaderContext);
