import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "../styles/NavBar.css";
import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import axiosInstance from "../api/axiosInstance";

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
                    console.log("notifications are", data.notifications[0]);
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

    const handleNotificationDropdownClick = () => {
        setIsNotificationOpen(!isNotificationOpen);
        console.log("Notification clicked");
    };
    const handleNotificationClick = (notification, index) => {
        // TODO: navigate to the appropriate page;
        let prefix = notification.relatedType.toLowerCase();
        if (prefix.endsWith("s")) {
            prefix = prefix.slice(0, -1);
        }
        const link = `/${Cookies.get("userType").toLowerCase()}/${prefix}/${
            notification.relatedId
        }`;
        if (notification.isRead) {
            navigate(link);
            return;
        }
        let newNotifications = notifications;
        setUnreadNotificationCount(unreadNotificationCount - 1);
        console.log("notification is ", notification);
        newNotifications[index].isRead = true;
        setNotifications(newNotifications);
        try {
            axiosInstance.put(`/general/markNotificationAsRead/${notification._id}`);
        } catch (err) {
            console.log(err);
        }

        setIsNotificationOpen(false);
        navigate(link);
    };
    const handleLogout = () => {
        // TODO: log out logic is not implemented
        Cookies.remove("userType");
        Cookies.set("currency", "EGP");
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
                                            <p className="notification-message">
                                                {notification.message}
                                            </p>
                                            <span className="notification-date">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </span>
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
