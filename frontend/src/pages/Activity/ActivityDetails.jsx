import React, { useState, useEffect, act } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// External libraries or API instance
import axiosInstance from "../../api/axiosInstance";

import { MapWrapper } from "../../components/MapWrapper.jsx";
import MapComponent from "../../components/MapComponent.jsx";
// Top-level components
import NavBar from "../../components/NavBar.jsx";
import ItineraryAndActivityHeader from "../../components/ItineraryAndActivityHeader.jsx";
import Tags from "../../components/Tags.jsx";
import Footer from "../../components/Footer.jsx";
import PopUp from "../../components/PopUpsGeneric/PopUp.jsx";
import SuccessfulBooking from "../../components/SuccessfulBooking.jsx";
import DateRangeDisplay from "../../components/DateRangeDisplay.jsx";
import DiscountCard from "../../components/DiscountCard.jsx";
import Button from "../../components/Button.jsx";

import Cookies from "js-cookie";

// Itinerary-related components
import ReviewsSection from "../Itinerary/ReviewsSection.jsx";
import CheckoutPopup from "../../components/CheckoutPopup.jsx";
import ProfileAndDescription from "../Itinerary/ProfileAndDescription.jsx";
import activityDefaultBackground from "../../assets/backgrounds/activity-details-background-temp.png";

// Other components
import Map from "../map.jsx";
import { CircularProgress } from "@mui/material";

// Styles
import "../../styles/ActivityDetails.css";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import CyclicPhotoDisplay from "../Itinerary/CyclicPhotoDisplay.jsx";

const ImageSlideshow = ({
    images,
    defaultImage, // Add defaultImage prop
    interval = 5000,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length === 0) return;

        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, interval);

        return () => clearInterval(timer);
    }, [images, interval]);

    // Determine which image URL to use
    const backgroundImageUrl =
        images && images.length > 0 ? images[currentImageIndex] : defaultImage;

    return (
        <div
            style={{
                width: "100vw",
                height: "30vh",
                color: "#FAE2B6",
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
            }}
        ></div>
    );
};

const BookingPayment = ({
    ticketCount,
    setTicketCount,
    maxTickets,
    walletBalance,
    totalPoints,
}) => {
    const [useWallet, setUseWallet] = useState(true);
    const [points, setPoints] = useState(0);
    const [promoCode, setPromoCode] = useState("");
    const [redeemedPoints, setRedeemedPoints] = useState(0);
    const basePrice = 60.16; // per ticket

    const handleRedeem = () => {
        // Example conversion: 10K points = 100 EGP
        const convertedAmount = Math.floor(points / 10000) * 100;
        setRedeemedPoints(convertedAmount);
    };

    const calculateTotal = () => {
        const itemsPrice = basePrice * ticketCount;
        const tax = itemsPrice * 0.069; // 6.9% tax
        return {
            itemsPrice: itemsPrice.toFixed(2),
            tax: tax.toFixed(2),
            promocode: "0.00",
            wallet: "0.00",
            total: (itemsPrice + tax).toFixed(2),
        };
    };

    const priceDetails = calculateTotal();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                fontSize: "1.25em",
            }}
        >
            {/* Number of Tickets */}
            <div className="mb-6">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                    }}
                >
                    <div>Number of Tickets</div>
                    <div>
                        <button
                            onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                            style={{
                                backgroundColor: "var(--accent-color)",
                                color: "white",
                                fontSize: "1.25em",
                                width: "35px",
                                borderRadius: "10px",
                                border: "none",
                                cursor: ticketCount <= 1 ? "not-allowed" : "pointer",
                            }}
                            disabled={ticketCount <= 0}
                        >
                            -
                        </button>
                        <span
                            className="text-xl"
                            style={{
                                marginLeft: "15px",
                                marginRight: "15px",
                                fontWeight: "bold",
                                fontSize: "1.15em",
                            }}
                        >
                            {ticketCount}
                        </span>
                        <button
                            onClick={() => setTicketCount(ticketCount + 1)}
                            style={{
                                backgroundColor: "var(--accent-color)",
                                fontSize: "1.25em",
                                width: "35px",
                                color: "white",
                                borderRadius: "10px",
                                border: "none",
                                cursor:
                                    ticketCount == maxTickets ? "not-allowed" : "pointer",
                            }}
                            disabled={ticketCount == maxTickets}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Use Wallet Balance */}
                <div className="flex items-center gap-2 mb-4">
                    <span>Use Wallet Balance</span>
                    <input
                        type="checkbox"
                        checked={useWallet}
                        onChange={(e) => setUseWallet(e.target.checked)}
                        style={{
                            accentColor: "var(--accent-color",
                            marginLeft: "20px",
                        }}
                    />
                </div>

                {/* Wallet Details */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        border: "1px solid #757575",
                        borderRadius: "4px",
                        marginTop: "12px",
                        width: "100%",
                        paddingBottom: "10px",
                        paddingLeft: "10px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "27%",
                            borderBottom: "1px bold var(--accent-color)",
                            width: "100%",
                        }}
                    >
                        <div>
                            <h3 className="font-semibold">Wallet Details</h3>
                            <p>Balance: {walletBalance} </p>
                        </div>
                        <div>
                            <h3 className="font-semibold">My Points</h3>
                            <p>Points: {totalPoints}</p>
                        </div>
                    </div>
                    <hr
                        style={{
                            border: "1px solid #757575",
                            margin: "15px",
                            width: "95%",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: "10%",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    paddingBottom: "10px",
                                }}
                            >
                                <p className="mb-2" style={{ fontSize: "1.12em" }}>
                                    Redeem My Points
                                </p>
                                <p className="text-sm text-gray-600">
                                    10K points → 100 EGP
                                </p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    border: "1px  black",
                                    width: "50%",
                                }}
                            >
                                <div
                                    style={{
                                        border: "1px  red",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={points}
                                        onChange={(e) => setPoints(e.target.value)}
                                        style={{
                                            width: "30%",
                                            border: "2px solid black",
                                            borderRadius: "25px",
                                            textAlign: "center",
                                        }}
                                    />
                                    →
                                    <input
                                        type="text"
                                        value={redeemedPoints}
                                        style={{
                                            width: "30%",
                                            border: "2px solid black",
                                            borderRadius: "25px",
                                            textAlign: "center",
                                        }}
                                    />
                                </div>
                                <Button
                                    stylingMode="always-dark"
                                    text={"Redeem"}
                                    handleClick={handleRedeem}
                                    width="100%"
                                    customStyle={{
                                        maxHeight: "5px",
                                        borderRadius: "60px",
                                        width: "30%",
                                        marginTop: "10px",
                                        fontSize: "15px",
                                        fontWeight: "bold",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promo Code */}
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <p style={{ fontSize: "1.12em" }}>Promo code</p>
                    <div style={{ display: "flex", gap: "10%" }}>
                        <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Promo code"
                            style={{
                                width: "70%",
                                border: "1px solid #757575",
                                borderRadius: "5px",
                                padding: "5px",
                                fontSize: "0.9em",
                            }}
                        />
                        <Button
                            stylingMode="always-dark"
                            text={"Apply"}
                            handleClick={handleRedeem}
                            width="100%"
                            customStyle={{
                                borderRadius: "60px",
                                width: "30%",
                                marginTop: "10px",
                                fontSize: "15px",
                                fontWeight: "bold",
                                height: "20px",
                            }}
                        />
                    </div>
                </div>

                {/* Price Details */}

                <div
                    style={{
                        border: "1px solid #E0E0E0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        width: "100%",
                        fontFamily: "Arial, sans-serif",
                        backgroundColor: "#fff",
                        marginTop: "2vh",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            backgroundColor: "#A0522D", // Brown color
                            color: "#fff",
                            height: "3vh",
                            padding: "0.5vw",
                            fontSize: "28px",
                            fontWeight: "bold",
                            paddingBottom: "20px",
                        }}
                    >
                        Price Details
                    </div>
                    {/* Body */}
                    <div style={{ padding: "10px" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                color: "#4F4F4F",
                            }}
                        >
                            <span>Items price</span>
                            <span>$ {priceDetails.itemsPrice}</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                color: "#4F4F4F",
                            }}
                        >
                            <span>Tax and service fees</span>
                            <span>$ {priceDetails.tax}</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                color: "#4F4F4F",
                            }}
                        >
                            <span>Promocode</span>
                            <span>$ {priceDetails.promocode}</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                color: "#4F4F4F",
                            }}
                        >
                            <span>Wallet</span>
                            <span>$ {priceDetails.wallet}</span>
                        </div>
                        <hr style={{ color: "#E0E0E0", margin: "10px" }} />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                color: "#4F4F4F",
                            }}
                        >
                            <span>Total</span>
                            <span>$ {priceDetails.total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActivityDetails = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState(null);
    const [activityData, setActivityData] = useState(null);
    const { activityId } = useParams();
    const [BookPopUp, setBookPopUp] = useState(false);
    const [isCheckoutPopupOpen, setIsCheckoutPopupOpen] = useState(false);
    const [bookingDonePopUp, setBookingDonePopUp] = useState(false);
    const [pointsAdded, setPointsAdded] = useState(0);
    const [advertiserName, setAdvertiserName] = useState("");
    const [ticketCount, setTicketCount] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [points, setPoints] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);

    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);

    const location = useLocation();

    //To retrieve user type from browser
    useEffect(() => {
        // Retrieve the userType from cookies when the component mounts
        const userTypeFromCookie = Cookies.get("userType");
        setUserType(userTypeFromCookie);
    }, []);

    //To retrieve activity data from the server
    useEffect(() => {
        if (activityData) return;

        const fetchActivityData = async () => {
            try {
                console.log(`Fetching activity data`);
                const activityResponse = await axiosInstance.get(
                    `activity/getActivity/${activityId}`
                );
                // setAdvertiserName(activityResponse.data.advertiser);
                setActivityData(activityResponse.data);
                console.log("activity data", activityResponse.data);
                setAdvertiserName(activityResponse.data.advertiserID.name);
            } catch (error) {
                console.error("Error fetching activity data:", error);
            }
        };

        if (activityId) {
            fetchActivityData();
        }
    }, [activityId]);
    //For mangaing page logic

    useEffect(() => {
        const fetchIsBookmarked = async () => {
            if (!activityData) return;
            if (userType !== "Tourist") return;
            try {
                const response = await axiosInstance.post(
                    `bookmark/getBookmarkStatus/`,
                    {
                        bookmarkIDs: [activityData._id],
                    },
                    { withCredentials: true }
                );
                console.log("is bookmarked data", response.data);
                setIsBookmarked(response.data[activityData._id]);
            } catch (error) {
                console.error("Error fetching is bookmarked:", error);
            }
        };
        fetchIsBookmarked();
    }, [activityData]);

    useEffect(() => {
        if (userType !== "Tourist") return;

        axiosInstance
            .get("/tourist/tourist", { withCredentials: true })
            .then((response) => {
                setPoints(response.data.loyalityPoints || 0);
                setWalletBalance(formatPrice(response.data?.wallet || 0));
            })
            .catch((error) => {
                console.error("Error fetching tourist:", error);
            });
    }, []);

    const handleBookmark = async () => {
        if (!activityData) return;
        try {
            const response = await axiosInstance.post(
                `bookmark/bookmark`,
                {
                    bookmarkType: "Activity",
                    bookmarkID: activityData._id,
                    isBookmarked,
                },
                { withCredentials: true }
            );
            console.log("Bookmark response:", response.data);
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error("Error bookmarking activity:", error);
        }
    };

    const handleBooking = async () => {
        try {
            const bookingResponse = await axiosInstance.post(
                "booking/createBooking",
                {
                    bookingType: "Activity",
                    typeId: activityData._id,
                    count: ticketCount,
                },
                { withCredentials: true }
            );

            // Check the response status
            if (bookingResponse.status === 201) {
                // Add any additional success handling here
                setPointsAdded(bookingResponse.data.pointsAdded);
                setBookPopUp(false);
                setBookingDonePopUp(true);
                activityData.freeSpots -= ticketCount;
                setTicketCount(0);
            } else {
                console.log(
                    "Booking response received, but status is not 201:",
                    bookingResponse.status
                );
                // Handle other status codes as needed
            }
        } catch (error) {
            console.error("Booking failed:", error);
            // Handle error here, like displaying a notification to the user
            if (error.response) {
                // The request was made and the server responded with a status code outside the 2xx range
                console.error("Error status:", error.response.status);
                console.error("Error data:", error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
            } else {
                // Something happened in setting up the request
                console.error("Error setting up request:", error.message);
            }
        }
    };

    if (!activityData) {
        return <CircularProgress />;
    }

    return (
        <div className="activity-details-container">
            <CyclicPhotoDisplay
                photos={activityData.pictures}
                width="95%"
                height="70vh"
            />
            <NavBar />

            <PopUp
                isOpen={BookPopUp}
                setIsOpen={setBookPopUp}
                // headerText={"Please fill in the following to complete your booking"}
                containsActionButton={ticketCount > 0}
                handleSubmit={handleBooking}
            >
                <BookingPayment
                    ticketCount={ticketCount}
                    setTicketCount={setTicketCount}
                    maxTickets={activityData.freeSpots}
                    walletBalance={walletBalance}
                    totalPoints={points}
                />
            </PopUp>

            <PopUp
                isOpen={bookingDonePopUp}
                setIsOpen={setBookingDonePopUp}
                headerText={"Booking Successful"}
                containsActionButton={false}
                cancelText={"Ok"}
            >
                <SuccessfulBooking points={pointsAdded} />
            </PopUp>

            <CheckoutPopup
                isOpen={isCheckoutPopupOpen}
                setIsOpen={setIsCheckoutPopupOpen}
                items={[
                    {
                        title: activityData.name,
                        price:
                            activityData.price * (1 - activityData.specialDiscount / 100),
                    },
                ]}
                successDirectUrl={"/tourist/bookings"}
                headerImage={activityData.pictures[0]}
                state={{ tab: "Activities" }}
                handleOnMount={async () => {
                    console.log("handleOnMount called");
                    const response = await axiosInstance.post(
                        "/booking/createBooking",
                        {
                            bookingType: "Activity",
                            typeId: activityData._id,
                            count: 1,
                        },
                        {
                            withCredentials: true,
                        }
                    );
                    localStorage.setItem("bookingId", response.data._id);
                }}
                handleOnSuccess={async (amountFromWallet) => {
                    const response = await axiosInstance.patch(
                        `/booking/completeBooking/${localStorage.getItem("bookingId")}`,
                        {
                            amountFromWallet,
                        },
                        {
                            withCredentials: true,
                        }
                    );
                }}
                handleOnFailure={async () => {
                    const response = await axiosInstance.delete(
                        `/booking/deleteBooking/${localStorage.getItem("bookingId")}`,
                        {
                            withCredentials: true,
                        }
                    );
                }}
            />

            <ItineraryAndActivityHeader
                mode="activity"
                title={activityData.name}
                category={activityData.category}
                isOpen={activityData.isOpenForBooking && activityData.freeSpots > 0}
                bookmark={handleBookmark}
                isBookmarked={isBookmarked}
                showBookmark={userType === "Tourist"}
            />

            <div className="activity-info">
                <div className="activity-info-left">
                    <ProfileAndDescription
                        mode="Activity"
                        name={advertiserName}
                        picture={
                            activityData.advertiserID.picture ||
                            "https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg"
                        }
                        description={activityData.description}
                        width={"80%"}
                        fontSize={"1.2em"}
                    ></ProfileAndDescription>

                    <Tags tags={activityData.tags} fontSize={"0.85em"} />
                    {/* Put a map Here */}
                    <div className="activity-location-on-map">
                        <div className="activity-location">
                            <img
                                src="/mapMarkerIcon.png"
                                alt=""
                                className="map-marker-icon"
                            />
                            <span>Activity Location</span>
                        </div>
                        <div style={{ height: "70vh", width: "50vw" }}>
                            <MapWrapper>
                                <MapComponent
                                    markerPosition={{
                                        lat: activityData?.Latitude,
                                        lng: activityData?.Longitude,
                                    }}
                                    customStyles={{ height: "100%", width: "100%" }}
                                />
                            </MapWrapper>
                        </div>
                    </div>
                </div>
                <div className="activity-info-right">
                    {/* <AvailableDates
						date={"2024-11-07T09:30:00.000Z"}
						width={"18vw"}
						fontSize={"0.8em"}
					/> */}
                    <DateRangeDisplay
                        startDate={activityData.startDate}
                        endDate={activityData.endDate}
                        width="75%"
                        height="10%"
                    />

                    {(!userType || userType == "Tourist" || userType == "Guest") && (
                        <DiscountCard
                            availableSeats={activityData.freeSpots}
                            price={activityData.price}
                            discountPercentage={activityData.specialDiscount}
                            width="65%"
                            height="25%"
                            showButton={
                                !location?.state?.id &&
                                activityData.isOpenForBooking &&
                                activityData.freeSpots > 0
                            }
                            onClick={() => {
                                // Open pop up with booking details
                                if (userType == "Guest" || !userType) {
                                    navigate("/signin");
                                    return;
                                }
                                // setBookPopUp(true);
                                setIsCheckoutPopupOpen(true);
                            }}
                        />
                    )}

                    <ReviewsSection
                        ratingIds={activityData.ratings}
                        width={"100%"}
                        fontSize={"12px"}
                    />
                </div>
            </div>
            <div
                style={{
                    marginRight: "80%",
                    marginBottom: "4vh",
                }}
            >
                <Button
                    stylingMode="always-light"
                    text="Back"
                    handleClick={() => navigate("/activities")}
                />
            </div>

            <Footer />
        </div>
    );
};

export default ActivityDetails;
