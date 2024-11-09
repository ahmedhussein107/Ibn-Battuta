import React from "react";
import { useEffect } from "react";
import { useHeader } from "./HeaderContext";
import "./Header.css";

const Header = () => {
    const { headerData, clearHeader } = useHeader();
    useEffect(() => {
        return () => clearHeader();
    }, [clearHeader]);
    return (
        <div
            className="image-container"
            style={{ backgroundImage: `url(${headerData.imageSrc})` }}
        >
            <div className="overlay-text">{headerData.text}</div>
            <div className="header-search-bar">{headerData.SearchBarComponent}</div>
            <div className="header-profile-picture">
                {headerData.ProfilePictureComponent}
            </div>
        </div>
    );
};

export default Header;
