import React, { useState, useEffect, act } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// External libraries or API instance
import axiosInstance from "../../api/axiosInstance";

// Top-level components
import NavBar from "../../components/NavBar.jsx";
import ItineraryAndActivityHeader from "../../components/ItineraryAndActivityHeader.jsx";
import Tags from "../../components/Tags.jsx";
import Footer from "../../components/Footer.jsx";
import PopUp from "../../components/PopUpsGeneric/PopUp.jsx";
import TicketCounter from "../../components/TicketCounter.jsx";
import SuccessfulBooking from "../../components/SuccessfulBooking.jsx";
import DateRangeDisplay from "../../components/DateRangeDisplay.jsx";
import DiscountCard from "../../components/DiscountCard.jsx";

import Cookies from "js-cookie";

// Itinerary-related components
import ReviewsSection from "../Itinerary/ReviewsSection.jsx";
import ProfileAndDescription from "../Itinerary/ProfileAndDescription.jsx";
import activityDefaultBackground from "../../assets/backgrounds/activity-details-background-temp.png";

// Other components
import Map from "../map.jsx";
import { CircularProgress } from "@mui/material";

// Styles
import "../../styles/ActivityDetails.css";

const ImageSlideshow = ({ 
    images, 
    defaultImage, // Add defaultImage prop
    interval = 5000 
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
    const backgroundImageUrl = images && images.length > 0 
      ? images[currentImageIndex] 
      : defaultImage;
  
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


const BookingPopUp = ({price, specialDiscount, freeSpots, ticketCount, setTicketCount}) =>{

    return (
        <TicketCounter
        pricePerPerson={
            price * (1 - specialDiscount / 100)
        }
        maxCount={freeSpots}
        currentCount={ticketCount}
        setCount={setTicketCount}
    />
    );
   

}

const BookingPayment = () => {
    const [ticketCount, setTicketCount] = useState(2);
    const [useWallet, setUseWallet] = useState(true);
    const [promoCode, setPromoCode] = useState('');
    const [redeemedPoints, setRedeemedPoints] = useState(0);
  
    const walletBalance = 24;
    const points = 90000;
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
        promocode: '0.00',
        wallet: '0.00',
        total: (itemsPrice + tax).toFixed(2)
      };
    };
  
    const priceDetails = calculateTotal();
  
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
        {/* Number of Tickets */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Number of Tickets</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                className="bg-brown-600 text-white w-6 h-6 rounded-full"
              >
                -
              </button>
              <span className="text-xl">{ticketCount}</span>
              <button
                onClick={() => setTicketCount(ticketCount + 1)}
                className="bg-brown-600 text-white w-6 h-6 rounded-full"
              >
                +
              </button>
            </div>
          </div>
  
          {/* Use Wallet Balance */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={useWallet}
              onChange={(e) => setUseWallet(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Use Wallet Balance</span>
          </div>
  
          {/* Wallet Details */}
          <div className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="font-semibold">Wallet Details</h3>
                <p>Balance: {walletBalance} $</p>
              </div>
              <div>
                <h3 className="font-semibold">My Points</h3>
                <p>Points: {points}</p>
              </div>
            </div>
  
            <div className="border-t pt-4">
              <p className="mb-2">Redeem My Points</p>
              <p className="text-sm text-gray-600">10K points → 100 EGP</p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={points}
                  readOnly
                  className="border rounded px-2 py-1 w-24"
                />
                →
                <input
                  type="text"
                  value={redeemedPoints}
                  readOnly
                  className="border rounded px-2 py-1 w-24"
                />
                <button
                  onClick={handleRedeem}
                  className="bg-brown-600 text-white px-4 py-1 rounded"
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
  
          {/* Promo Code */}
          <div className="mb-4">
            <p className="mb-2">Promo code</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code"
                className="border rounded px-3 py-2 flex-grow"
              />
              <button className="bg-brown-600 text-white px-6 py-2 rounded">
                Apply
              </button>
            </div>
          </div>
  
          {/* Price Details */}
          <div className="bg-brown-600 text-white p-3 mb-4">
            <h3 className="font-semibold mb-2">Price Details</h3>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Items price</span>
              <span>$ {priceDetails.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax and service fees</span>
              <span>$ {priceDetails.tax}</span>
            </div>
            <div className="flex justify-between">
              <span>Promocode</span>
              <span>$ {priceDetails.promocode}</span>
            </div>
            <div className="flex justify-between">
              <span>Wallet</span>
              <span>$ {priceDetails.wallet}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total</span>
              <span>$ {priceDetails.total}</span>
            </div>
          </div>
  
          {/* Action Buttons */}
          <div className="flex justify-between">
            <button className="border border-brown-600 text-brown-600 px-6 py-2 rounded">
              cancel
            </button>
            <button className="bg-brown-600 text-white px-6 py-2 rounded">
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  };


const   ActivityDetails = () =>{
    const navigate = useNavigate();
    const [userType, setUserType] = useState(null);
    const [activityData, setActivityData] = useState(null);
    const { activityId } = useParams();
    const [BookPopUp, setBookPopUp] = useState(false);
    const [bookingDonePopUp, setBookingDonePopUp] = useState(false);
    const [pointsAdded, setPointsAdded] = useState(0);
    const [advertiserName, setAdvertiserName] = useState("");
    const [ticketCount, setTicketCount] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);

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
            // TODO: add different ways of payeen

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
            <ImageSlideshow  images={activityData.pictures} defaultImage={activityDefaultBackground}/>
            <NavBar />

            <PopUp
                isOpen={BookPopUp}
                setIsOpen={setBookPopUp}
                headerText={"Please fill in the following to complete your booking"}
                containsActionButton={ticketCount > 0}
                handleSubmit={handleBooking}
            >
                <TicketCounter
                    pricePerPerson={
                        activityData.price * (1 - activityData.specialDiscount / 100)
                    }
                    maxCount={activityData.freeSpots}
                    currentCount={ticketCount}
                    setCount={setTicketCount}
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

            <ItineraryAndActivityHeader
                mode="activity"
                title={activityData.name}
                category={activityData.category}
                isOpen={activityData.isOpenForBooking}
                bookmark={handleBookmark}
                isBookmarked={isBookmarked}
                showBookmark={userType === "Tourist"}
            />
        
            <div className="activity-info">
                <div className="activity-info-left">
                    <ProfileAndDescription
                        mode="Activity"
                        name={advertiserName}
                        picture={activityData.advertiserID.picture}
                        description={activityData.description}
                        width={"80%"}
                        fontSize={"1.2em"}
                    ></ProfileAndDescription>

                    <Tags tags={activityData.tags} fontSize={"0.85em"} />
                    {/* Put a map Here */}
                    <div className="activity-location-on-map">
                        <div className="activity-location">
                            <img src="/mapMarkerIcon.png" alt="" className="map-marker-icon" />
                            <span>Activity Location</span>
                        </div>
                        <Map
                            setMarkerPosition={(position) => {}}
                            defaultPosition={
                                activityData.Latitude
                                    ? {
                                          lat: activityData.Latitude,
                                          lng: activityData.Longitude,
                                      }
                                    : null
                            }
                            customStyles={{ height: "70vh", width: "50vw" }}
                        />
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
                            onClick={() => {
                                // Open pop up with booking details
                                if (userType == "Guest" || !userType) {
                                    navigate("/signin");
                                    return;
                                }

                                setBookPopUp(true);
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

            <Footer />
        </div>
    );
}


export default ActivityDetails;
