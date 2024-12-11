import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "../styles/NavBar.css";
import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import axiosInstance from "../api/axiosInstance";
import TourIcon from "@mui/icons-material/Tour";
import ChatIcon from "@mui/icons-material/Chat";
import RowingIcon from "@mui/icons-material/Rowing";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import DiscountIcon from "@mui/icons-material/Discount";

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

const touristProfileDropdown = [
    { "My Profile": "/tourist/profile" },
    { "My Bookings": "/tourist/bookings" },
    { "My Orders": "/tourist/orders" },
    { "My Bookmarks": "/tourist/bookmarks" },
    { "My Complaints": "/tourist/complaints" },
];

const useClickOutside = (callback) => {
    const ref = useRef();
    const notificationIconRef = useRef();

    useEffect(() => {
        const handleClick = (event) => {
            if (
                notificationIconRef.current &&
                notificationIconRef.current.contains(event.target)
            ) {
                return;
            }
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("touchstart", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("touchstart", handleClick);
        };
    }, [callback]);

    return [ref, notificationIconRef];
};

const NavBar = () => {
    const [userType, setUserType] = useState("Guest");
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const navigate = useNavigate();
    const [dropdownRef, notificationIconRef] = useClickOutside(() => {
        setIsNotificationOpen(false);
    });
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
                    console.log("notifications are", data.notifications);
                    setUnreadNotificationCount(data.count);
                    setNotifications(
                        data.notifications.sort(
                            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                        )
                    );
                } else if (data.type === "onlineNotification") {
                    setUnreadNotificationCount((prevCount) => prevCount + 1);
                    setNotifications((prevNotifications) =>
                        [...prevNotifications, data.notification].sort(
                            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                        )
                    );
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

    const handleNotificationDropdownClick = () => {
        setIsNotificationOpen(!isNotificationOpen);
        console.log("Notification clicked");
    };
    const handleNotificationClick = (notification, index) => {
        // ["Complaint", "Activity", "Itinerary", "Product", "PromoCode"],

        let url = null;

        switch (notification.relatedType) {
            case "Complaint":
                url = `/${userType.toLowerCase()}/complaint/${notification.relatedId}`;
                break;
            case "Activity":
                url = `/activity-details/${notification.relatedId}`;
                break;
            case "Itinerary":
                url = `/itinerary/itinerary-details/${notification.relatedId}`;
                break;
            case "Product":
                url = `/shop`;
                break;
        }
        console.log("the url is:", url);

        if (url && notification.isRead) {
            navigate(url);
            return;
        }

        let newNotifications = notifications;
        setUnreadNotificationCount(unreadNotificationCount - 1);
        newNotifications[index].isRead = true;
        setNotifications(newNotifications);
        try {
            axiosInstance.put(`/general/markNotificationAsRead/${notification._id}`);
        } catch (err) {
            console.log(err);
        }

        setIsNotificationOpen(false);
        navigate(url);
    };
    const handleLogout = () => {
        // TODO: log out logic is not implemented
        Cookies.remove("userType");
        Cookies.remove("jwt");
        Cookies.remove("profileImage");
        Cookies.set("currency", "EGP");
        setUserType("Guest");
        navigate("/");
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
            <img
                style={{
                    borderRadius: "25px",
                    height: "6.2vh",
                    marginLeft: "-1%",
                }}
                src="/logo.png"
            />

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
                            stylingMode="always-dark"
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
                            ref={notificationIconRef}
                            className="notification-icon"
                            onClick={handleNotificationDropdownClick}
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
                        {isNotificationOpen && (
                            <div ref={dropdownRef} className="notification-dropdown">
                                <h4>Notifications</h4>
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <div
                                            key={index}
                                            className={`notification-item ${
                                                notification.isRead
                                                    ? "read"
                                                    : notification.type
                                            }`}
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification,
                                                    index
                                                )
                                            }
                                        >
                                            <div className="notifications-icon">
                                                {(() => {
                                                    switch (notification.relatedType) {
                                                        case "Itinerary":
                                                            return (
                                                                <TourIcon className="notification-type-icon" />
                                                            );
                                                        case "PromoCode":
                                                            return (
                                                                <DiscountIcon className="notification-type-icon" />
                                                            );
                                                        case "Complaint":
                                                            return (
                                                                <ChatIcon className="notification-type-icon" />
                                                            );
                                                        case "Activity":
                                                            return (
                                                                <RowingIcon className="notification-type-icon" />
                                                            );
                                                        case "Product":
                                                            return (
                                                                <ProductionQuantityLimitsIcon className="notification-type-icon" />
                                                            );
                                                        default:
                                                            return (
                                                                <ChatIcon className="notification-type-icon" />
                                                            ); // Default icon
                                                    }
                                                })()}
                                            </div>
                                            <div className="notification-content">
                                                <p className="notification-message">
                                                    {notification.message}
                                                </p>
                                                <span className="notification-date">
                                                    <i className="fas fa-calendar-alt"></i>
                                                    {new Date(
                                                        notification.createdAt
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-notifications">
                                        No new notifications
                                    </p>
                                )}
                            </div>
                        )}
                        <div className="profile-dropdown">
                            <img
                                src={
                                    Cookies.get("profileImage") ||
                                    "https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg"
                                }
                                alt="Profile"
                                className="profile-image"
                            />
                            <div className="dropdown-content">
                                {userType === "Tourist" ? (
                                    touristProfileDropdown.map((item, index) => {
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
                                ) : userType === "Guest" ? null : (
                                    <Link
                                        to={`/${userType.toLowerCase()}/profile`}
                                        className="dropdown-item"
                                    >
                                        {"My Profile"}
                                    </Link>
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
