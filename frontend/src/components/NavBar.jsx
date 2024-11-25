import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "../styles/NavBar.css";
import { useState, useEffect } from "react";
import Button from "./Button";

import {
    guestNavbarItems,
    touristNavbarItems,
    sellerNavbarItems,
    tourGuideNavbarItems,
    advertiserNavbarItems,
    governorNavbarItems,
    adminNavbarItems,
} from "../constants/navbar.constants";
import UserProfile from "./UserProfile";

const URI = import.meta.env.VITE_API_URI;
const adminId = import.meta.env.VITE_ADMIN_ID;
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
    { "My Profile": "/tourist-profile" },
    { "My Bookings": "/bookings" },
    { "My Orders": "/orders" },
    { "My Bookmarks": "link" },
    { "My Complaints": "/complaints" },
];

const NavBar = () => {
    const [userType, setUserType] = useState("Guest");
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const cookieUserType = Cookies.get("userType") || "Guest";
        console.log("User type from cookie:", cookieUserType);
        if (cookieUserType && cookieUserType !== "undefined") {
            setUserType(cookieUserType);
        }
    }, []);

    useEffect(() => {
        if (userType !== "Guest") {
            console.log("WebSocket connection establishing");
            const socket = new WebSocket(
                `${URI.replace("http://", "ws://")}notifications?token=${Cookies.get(
                    "jwt"
                )}`
            );

            socket.onopen = () => {
                console.log("WebSocket connection established");
            };

            socket.onmessage = (event) => {
                console.log("WebSocket message received:", event.data);
                const data = JSON.parse(event.data);
                console.log("Message received:", data); // Log received data
                if (data.type === "initialNotifications") {
                    setUnreadNotificationCount(data.count);
                    setNotifications(data.notifications);
                } else if (data.type === "onlineNotification") {
                    setUnreadNotificationCount((prevCount) => prevCount + 1);
                    setNotifications((prevNotifications) => [
                        ...prevNotifications,
                        data.notification,
                    ]);
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
        navigate("/");
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
            <img
                style={{
                    padding: "0px",
                    borderRadius: "20px",
                    height: "5.2vh",
                    objectFit: "contain",
                    marginLeft: "-.8vw",
                }}
                src="/logo.png"
            />

            {/* Center: Navbar items */}
            <div className="navbar-links">
                {navbarItems.map((item, index) => renderItem(item, index))}
            </div>

            <div className="navbar-profile">
                {userType === "Guest" ? (
                    <>
                        <Link to="/signin" className="auth-link">
                            Login
                        </Link>

                        <Button
                            stylingMode="submit"
                            text={"Sign Up"}
                            handleClick={() => navigate("/select-your-role")}
                            isLoading={false}
                            width="auto"
                            customStyle={{
                                marginLeft: "20px",
                                width: "120",
                                height: "55px",
                                minHieght: "70px",
                                borderRadius: "60px",
                            }}
                        />
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
                            {unreadNotificationCount > 0 && (
                                <span className="notification-badge">
                                    {unreadNotificationCount}
                                </span>
                            )}
                        </div>
                        <div className="profile-dropdown">
                            <img
                                src="https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg"
                                alt="Profile"
                                className="profile-image"
                            />
                            <div className="dropdown-content">
                                {userType === "Admin" ? (
                                    <Link to={"/admin-profile"} className="dropdown-item">
                                        {"My Profile"}
                                    </Link>
                                ) : userType === "Seller" ? (
                                    <Link
                                        to={"/seller-profile"}
                                        className="dropdown-item"
                                    >
                                        {"My Profile"}
                                    </Link>
                                ) : userType === "Advertiser" ? (
                                    <Link
                                        to={"/advertiser-profile"}
                                        className="dropdown-item"
                                    >
                                        {"My Profile"}
                                    </Link>
                                ) : userType === "Governor" ? (
                                    <Link
                                        to={"/governor-profile"}
                                        className="dropdown-item"
                                    >
                                        {"My Profile"}
                                    </Link>
                                ) : userType === "TourGuide" ? (
                                    <Link
                                        to={"/tourguide-profile"}
                                        className="dropdown-item"
                                    >
                                        {"My Profile"}
                                    </Link>
                                ) : userType === "Tourist" ? (
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
                                ) : null}
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
