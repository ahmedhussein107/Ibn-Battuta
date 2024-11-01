/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/NavBar.css";
import { useState } from "react";
const navbarUserItems = {
    Guest: [
        { Home: "link" },
        {
            Explore: [
                { Activities: "link" },
                { Itineraries: "link" },
                { Landmark: "link" },
            ],
        },
        { Shop: "link" },
    ],
    Tourist: [
        { Home: "link" },
        {
            Explore: [
                { Activities: "link" },
                { Itineraries: "link" },
                { Landmark: "link" },
            ],
        },
        { Travel: { Flights: "link", Hotels: "link", Packages: "link" } },
        { Shop: "link" },
    ],
    Seller: [
        { Home: "link" },
        { Browse: "link" },
        { Inventroy: "link" },
        { Analytics: "link" },
    ],
    TourGuide: [
        { Home: "link" },
        { Browse: [{ Activites: "link" }, { Itineraries: "link" }] },
        { Assigned: "link" },
        { Analytics: "link" },
    ],
    Advertiser: [
        { Home: "link" },
        { Browse: "link" },
        { Assigned: "link" },
        { Analytics: "link" },
    ],
    Governor: [{ Home: "link" }, { Browse: "link" }],
    Admin: [
        { Dashboard: "link" },
        { Inventory: "link" },
        {
            "Manage Users": [
                { "Users List": "link" },
                { "Pending Users": "link" },
                { Complaints: "link" },
            ],
        },
        {
            Browse: [
                { Activities: "link" },
                { Itineraries: "link" },
                { Landmarks: "link" },
                { Products: "link" },
            ],
        },
        { Cateogrization: [{ Tags: "link" }, { Category: "link" }] },
    ],
};
const NavBar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    let userType = Cookies.get("userType") || "Guest";
    const navbarItems = navbarUserItems[userType];

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        Cookies.remove("userType");
        // Add logout logic here
        window.location.reload(); // Refresh the page after logout
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Left side: Website icon or banner */}
                <div className="navbar-left-circle">
                    <Link to="/" className="navbar-logo">
                        WebsiteLogo
                    </Link>
                </div>

                {/* Center: Navbar items */}
                <div className="navbar-links">
                    {navbarItems.map((item, index) => {
                        const [label, linkOrSubMenu] = Object.entries(item)[0];
                        return Array.isArray(linkOrSubMenu) ? (
                            <div className="dropdown" key={index}>
                                <span className="dropdown-title">{label}</span>
                                <div className="dropdown-content">
                                    {linkOrSubMenu.map((subItem, subIndex) => {
                                        const [subLabel, subLink] =
                                            Object.entries(subItem)[0];
                                        return (
                                            <Link key={subIndex} to={subLink}>
                                                {subLabel}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <Link key={index} to={linkOrSubMenu}>
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side: Profile or login/signup */}
                <div className="navbar-right-circle">
                    {userType === "Guest" ? (
                        <>
                            <Link to="/login" className="auth-link">
                                Login
                            </Link>
                            <Link to="/signup" className="auth-link">
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <div className="profile-dropdown">
                            <img
                                src="/path/to/profile-image.jpg"
                                alt="Profile"
                                className="profile-image"
                                onClick={handleDropdownToggle}
                            />
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item">
                                        Profile
                                    </Link>
                                    <span
                                        className="dropdown-item"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
