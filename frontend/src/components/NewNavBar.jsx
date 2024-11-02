/* eslint-disable react/no-unescaped-entities */
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "../styles/NavBar.css";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
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
        { Categorization: [{ Tags: "link" }, { Category: "link" }] },
    ],
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

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src="/logo.png" alt="Website Logo" className="logo-image" />
            </Link>
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
                                        <Link
                                            key={subIndex}
                                            to={subLink}
                                            className="dropdown-item"
                                        >
                                            {subLabel}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <Link key={index} to={linkOrSubMenu} className="simple-link">
                            {label}
                        </Link>
                    );
                })}
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
