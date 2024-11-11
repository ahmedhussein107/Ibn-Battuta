import React, { useState, useEffect, act } from "react";
import { useLocation, useParams } from "react-router-dom";

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
import ActivityPhotos from "../../components/ActivityPhotos.jsx";
import DateRangeDisplay from "../../components/DateRangeDisplay.jsx";
import DiscountCard from "../../components/DiscountCard.jsx";

import convert from "../api/convert";
import Cookies from "js-cookie";

// Itinerary-related components
import ReviewsSection from "../Itinerary/ReviewsSection.jsx";
import ProfileAndDescription from "../Itinerary/ProfileAndDescription.jsx";
import Book from "../../components/ItineraryDetails/Book.jsx";

// Other components
import Map from "../map.jsx";

// Styles
import "../../styles/ActivityDetails.css";

export default function ActivityDetails() {
    const [activityData, setActivityData] = useState(null);
    const { activityId } = useParams();
    // console.log(`The activity id ${activityId}`);
    useEffect(() => {
        console.log("Here");
        if (activityData) return;

        const fetchActivityData = async () => {
            try {
                console.log(`Fetching activity data`);
                const activityResponse = await axiosInstance.get(
                    `activity/getActivity/${activityId}`
                );

                setActivityData(activityResponse.data);
            } catch (error) {
                console.error("Error fetching activity data:", error);
            }
        };

        if (activityId) {
            fetchActivityData();
        }
    }, [activityId]);
    //For mangaing page logic
    const [BookPopUp, setBookPopUp] = useState(false);
    const [bookingDonePopUp, setBookingDonePopUp] = useState(false);
    const [pointsAdded, setPointsAdded] = useState(0);

    const [advertiserName, setAdvertiserName] = useState("");
    const [ticketCount, setTicketCount] = useState(0);
    const photos = [
        "https://media.istockphoto.com/id/925293368/photo/paradise-tropical-beach-with-rocks-palm-trees-and-turquoise-water-in-sunshine-seychelles-30.webp?s=2048x2048&w=is&k=20&c=zoG4berF7XNOnuex9vx7MFEpYHy48FCyqj9TTOu51CE=",
        "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?cs=srgb&dl=pexels-fabianwiktor-994605.jpg&fm=jpg",
    ];

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

    //For advertiser name
    useEffect(() => {
        const fetchAdvertiser = async () => {
            if (!activityData) return;
            try {
                console.log("Im here");
                const response = await axiosInstance.get(
                    `advertiser/advertiser/${activityData.advertiserID}`
                );
                const advertiser = response.data;
                setAdvertiserName(advertiser.name);
            } catch (error) {
                console.error("Error fetching advertiser: ", error);
            }
        };
        fetchAdvertiser();
    }, [activityData]);

    if (!activityData) {
        return <div>Loading...</div>;
    }
    return (
        <div className="activity-details-container">
            <NavBar />

            <PopUp
                isOpen={BookPopUp}
                setIsOpen={setBookPopUp}
                headerText={"Please fill in the following to complete your booking"}
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
            />
            <ActivityPhotos
                width="100%"
                height={"70vh"}
                interval={5000}
                photos={photos}
            />
            <div className="activity-info">
                <div className="activity-info-left">
                    <ProfileAndDescription
                        mode="Activity"
                        name={advertiserName}
                        // picture={tourGuidePicture}
                        description={activityData.description}
                        width={"80%"}
                        fontSize={"1.2em"}
                    ></ProfileAndDescription>

                    <Tags tags={activityData.tags} fontSize={"0.85em"} />
                    {/* Put a map Here */}
                    <div className="activity-location-on-map">
                        <div className="activity-location">
                            <img src="/mapMarkerIcon.png" alt="" />
                            <span>Activity Location</span>
                        </div>
                        <Map
                            setMarkerPosition={(position) => {}}
                            defaultPosition={{
                                lat: 29.9792,
                                lng: 31.1342,
                            }}
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

                    <DiscountCard
                        availableSeats={activityData.freeSpots}
                        price={activityData.price}
                        discountPercentage={activityData.specialDiscount}
                        width="65%"
                        height="25%"
                        onClick={() => {
                            // Open pop up with booking details
                            setBookPopUp(true);
                        }}
                    />

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
