/* eslint-disable react/no-unescaped-entities */
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "../styles/NavBar.css";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

import {
    guestNavbarItems,
    touristNavbarItems,
    sellerNavbarItems,
    tourGuideNavbarItems,
    advertiserNavbarItems,
    governorNavbarItems,
    adminNavbarItems,
} from "../constants/navbar.constants";

const navbarUserItems = {
    Guest: guestNavbarItems,
    Tourist: touristNavbarItems,
    Seller: sellerNavbarItems,
    TourGuide: tourGuideNavbarItems,
    Advertiser: advertiserNavbarItems,
    Governor: governorNavbarItems,
    Admin: adminNavbarItems,
};

const touristProfileDropdonw = [
    { "My Profile": "link" },
    { "My Bookings": "link" },
    { "My Bookmarks": "link" },
    { "My Complaints": "link" },
];

const NavBar = () => {
    const [userType, setUserType] = useState("Guest");
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        const cookieUserType = Cookies.get("userType") || "Guest";
        setUserType(cookieUserType);
        console.log("User type from cookie:", cookieUserType);
    }, []);

    useEffect(() => {
        if (userType !== "Guest") {
            console.log("WebSocket connection establishing");
            const socket = new WebSocket(
                `ws://localhost:3000/notifications?token=${Cookies.get("jwt")}`
            );

            socket.onopen = () => {
                console.log("WebSocket connection established");
            };

            socket.onmessage = (event) => {
                console.log("WebSocket message received:", event.data);
                const data = JSON.parse(event.data);
                console.log("Message received:", data); // Log received data
                if (data.type === "notificationCount") {
                    setNotificationCount(data.count);
                }
            };

            socket.onclose = () => {
                console.log("WebSocket connection closed");
            };

            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            return () => {
                socket.close();
            };
        }
    }, [userType]);

    const navbarItems = navbarUserItems[userType];

    const handleNotificationClick = () => {
        // TODO: notification logic is not implemented
        console.log("Notification clicked");
    };
    const handleLogout = () => {
        // TODO: log out logic is not implemented
        Cookies.remove("userType");
        setUserType("Guest");
        window.location.reload();
    };

    const renderDropdownItem = (label, index, dropdown) => {
        return (
            <div className="dropdown" key={index}>
                <span className="dropdown-title">{label}</span>
                <div className="dropdown-content">
                    {dropdown.map((subItem, subIndex) => {
                        const [subLabel, subLink] = Object.entries(subItem)[0];
                        return (
                            <Link key={subIndex} to={subLink} className="dropdown-item">
                                {subLabel}
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderItem = (item, index) => {
        const [label, linkOrSubMenu] = Object.entries(item)[0];
        if (Array.isArray(linkOrSubMenu)) {
            return renderDropdownItem(label, index, linkOrSubMenu);
        }
        return (
            <Link key={index} to={linkOrSubMenu} className="simple-link">
                {label}
            </Link>
        );
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src="/logo.png" alt="Website Logo" className="logo-image" />
            </Link>
            {/* Center: Navbar items */}
            <div className="navbar-links">
                {navbarItems.map((item, index) => renderItem(item, index))}
            </div>

            <div className="navbar-profile">
                {userType === "Guest" ? (
                    <>
                        <Link to="/login" className="auth-link">
                            Login
                        </Link>
                        <Button
                            onClick={() => navigate("/signup")}
                            className="auth-button"
                        >
                            Sign Up
                        </Button>
                    </>
                ) : (
                    <div className="notifications-profile">
                        <div
                            className="notification-icon"
                            onClick={handleNotificationClick}
                        >
                            <FontAwesomeIcon
                                icon={faBell}
                                className="notification-image"
                            />
                            <span className="notification-badge">
                                {notificationCount}
                            </span>
                        </div>
                        <div className="profile-dropdown">
                            <img
                                src="https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg"
                                alt="Profile"
                                className="profile-image"
                            />
                            <div className="dropdown-content">
                                {userType !== "Tourist" ? (
                                    <Link to={"/profile"} className="dropdown-item">
                                        {"My Profile"}
                                    </Link>
                                ) : (
                                    touristProfileDropdonw.map((item, index) => {
                                        const [label, link] = Object.entries(item)[0];
                                        return (
                                            <Link
                                                key={index}
                                                to={link}
                                                className="dropdown-item"
                                            >
                                                {label}
                                            </Link>
                                        );
                                    })
                                )}
                                <div className="dropdown-separator"></div>
                                <div className="log-out" onClick={handleLogout}>
                                    Logout
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
