import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// External libraries or API instance
import axiosInstance from "../../api/axiosInstance";
import Cookies from "js-cookie";

// Components relevant to this file
import ReviewsSection from "./ReviewsSection.jsx";
import ProfileAndDescription from "./ProfileAndDescription.jsx";
import CyclicPhotoDisplay from "./CyclicPhotoDisplay.jsx";

// Top-level components
import ItineraryAndActivityHeader from "../../components/ItineraryAndActivityHeader.jsx";
import Tags from "../../components/Tags.jsx";
import Accessibility from "../../components/Accessibility.jsx";
import Footer from "../../components/Footer.jsx";
import PopUp from "../../components/PopUpsGeneric/PopUp.jsx";
import TicketCounter from "../../components/TicketCounter.jsx";
import SuccessfulBooking from "../../components/SuccessfulBooking.jsx";
import usePageHeader from "../../components/Header/UseHeaderPage.jsx";

// Itinerary details components
import Book from "../../components/ItineraryDetails/Book.jsx";
import AvailableDates from "../../components/ItineraryDetails/AvailableDates.jsx";
import ItineraryTimeline from "../../components/ItineraryTimline.jsx";
import DateRangeDisplay from "../../components/DateRangeDisplay.jsx";

// Styles
import "../../styles/ItineraryDetails.css";
import Button from "../../components/Button";
import Alert from "@mui/material/Alert";
import LanguageIcon from "@mui/icons-material/Language";
import PlaceIcon from "@mui/icons-material/Place";
const ItineraryDetails = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        // Retrieve the userType from cookies when the component mounts
        const userTypeFromCookie = Cookies.get("userType");
        setUserType(userTypeFromCookie);
    }, []);
    const location = useLocation();
    usePageHeader(null, null);
    //6703f5310ecc1ad25ff95144
    const { itineraryId } = useParams();
    const [itinerary, setItinerary] = useState(null);
    //For managing itinerary data
    const [photoList, setPhotoList] = useState([]);
    const [pointsAdded, setPointsAdded] = useState(0);
    const [tourGuideName, setTourGuideName] = useState(null);
    const [tourGuidePicture, setTourGuidePicture] = useState(null);
    const [activities, setActivities] = useState([]);
    const [ticketCount, setTicketCount] = useState(0);
    const [freeSpots, setFreeSpots] = useState(Number.MAX_VALUE); // Initialize with maximum number
    const [isBookmarked, setIsBookmarked] = useState(false);
    const totalPrice = itinerary ? itinerary.price * ticketCount : 0;
    const [alert, setAlert] = useState({ open: false, severity: "info", message: "" });

    //For mangaing page logic
    const [BookPopUp, setBookPopUp] = useState(false);
    const [bookingDonePopUp, setBookingDonePopUp] = useState(false);

    // Add this check for bookingID
    const hasBookingID = location.state?.id;

    const showAlert = (severity, message) => {
        setAlert({ open: true, severity, message });
        // setTimeout(() => {
        //     setAlert({ open: false, severity: "", message: "" }); // Close the alert after some time
        // }, 8000); // Alert will close after 5 seconds
    };

    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                const itineraryResponse = await axiosInstance.get(
                    `itinerary/getItinerary/${itineraryId}`
                );
                setItinerary(itineraryResponse.data);
                console.log(itineraryResponse.data);
                setTourGuideName(itineraryResponse.data.tourguideID.name);
                setTourGuidePicture(itineraryResponse.data.tourguideID.picture);
            } catch (err) {
                console.error("Error fetching itinerary:", err);
                showAlert("error", "Error fetching itinerary:", err);
            }
        };
        fetchItinerary();
    }, [itineraryId]);

    useEffect(() => {
        const fetchIsBookmarked = async () => {
            if (!itinerary) return;
            if (userType !== "Tourist") return;
            try {
                const response = await axiosInstance.post(
                    `bookmark/getBookmarkStatus/`,
                    {
                        bookmarkIDs: [itinerary._id],
                    },
                    { withCredentials: true }
                );
                console.log("is bookmarked data", response.data);
                setIsBookmarked(response.data[itinerary._id]);
            } catch (error) {
                console.error("Error fetching is bookmarked:", error);
                showAlert("error", "Error fetching is bookmarked:", error);
            }
        };
        fetchIsBookmarked();
    }, [itinerary]);

    useEffect(() => {
        const fetchFreeSpots = async () => {
            if (!itinerary) return;
            try {
                const response = await axiosInstance.get(
                    `itinerary/getFreeSpots/${itinerary._id}`
                );
                console.log("response data", response.data);
                setFreeSpots(response.data);
            } catch (error) {
                console.error("Error fetching free spots:", error);
                showAlert("error", "Error fetching free spots:", error);
            }
        };
        fetchFreeSpots();
    }, [itinerary, BookPopUp]);
    useEffect(() => {
        console.log("freeSpots", freeSpots);
    }, [freeSpots]);

    const handleBookmark = async () => {
        if (!itinerary) return;
        try {
            const response = await axiosInstance.post(
                `bookmark/bookmark`,
                {
                    bookmarkType: "Itinerary",
                    bookmarkID: itinerary._id,
                    isBookmarked,
                },
                { withCredentials: true }
            );
            console.log("Bookmark response:", response.data);
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error("Error bookmarking itinerary:", error);
            showAlert("error", "Error bookmarking itinerary:", error);
        }
    };

    const handleBooking = async () => {
        if (!itinerary) return;
        try {
            // TODO: add different ways of payeen

            const bookingResponse = await axiosInstance.post(
                "booking/createBooking",
                {
                    bookingType: "Itinerary",
                    typeId: itinerary._id,
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
            showAlert("error", "Booking failed:", error);
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

    //For activities and photos
    useEffect(() => {
        if (!itinerary) return;
        const fetchActivites = async () => {
            try {
                const activitiesData = await Promise.all(
                    itinerary.activities.map(async (activityObj) => {
                        // First API call to get the rating details
                        const isCustom = activityObj.activityType != "Activity";
                        const activityResponse = await axiosInstance.get(
                            !isCustom
                                ? `activity/getActivity/${activityObj.activity}`
                                : `customActivity/getCustomActivity/${activityObj.activity}`
                        );
                        const activity = activityResponse.data;

                        // Extract and format start and end times
                        const formatTime = (date) => {
                            const options = {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            };
                            return new Date(date).toLocaleTimeString("en-US", options);
                        };

                        const startTimeFormatted = formatTime(activityObj.startTime);
                        const endTimeFormatted = formatTime(activityObj.endTime);

                        // Calculate duration in minutes
                        const durationMs =
                            new Date(activityObj.endTime) -
                            new Date(activityObj.startTime);
                        const durationMinutes = Math.floor(durationMs / 60000); // convert ms to minutes

                        // Construct the activity object with formatted times and duration
                        return {
                            activityType: activityObj.activityType,
                            activityData: activity,
                            startTime: startTimeFormatted,
                            endTime: endTimeFormatted,
                            duration: `${Math.floor(durationMinutes / 60)}h ${
                                durationMinutes % 60
                            }m`,
                        };
                    })
                );

                const photosData = activitiesData
                    .filter(
                        (activity) =>
                            activity.activityType === "Activity" &&
                            activity.activityData.pictures
                    )
                    .flatMap((activity) => activity.activityData.pictures);

                photosData.push(itinerary.picture);

                setPhotoList(photosData);
                // Update the state with the reviews data
                setActivities(activitiesData);
            } catch (error) {
                console.error("Error fetching activities: ", error);
                showAlert("error", "Error fetching activities:", error);
            }
        };

        fetchActivites();
    }, [itinerary]);

    if (!itinerary) return null;
    return (
        <div className="itinerary-details-container">
            <CyclicPhotoDisplay photos={photoList} width="95%" height="70vh" />

            <ItineraryAndActivityHeader
                mode="itinerary"
                title={itinerary.name}
                bookmark={handleBookmark}
                isBookmarked={isBookmarked}
                showBookmark={userType === "Tourist"}
            />

            <div style={{ display: "flex", width: "100%", gap: "30%", marginLeft: "5%" }}>
                {" "}
                <div className="language-container">
                    <div className="language-header">
                        <PlaceIcon fontSize="large" className="language-icon" />
                        <span> {itinerary.pickupLocation}</span>
                    </div>
                </div>
                <div className="language-container">
                    <div className="language-header">
                        <LanguageIcon fontSize="large" className="language-icon" />
                        <span> Language: {itinerary.language}</span>
                    </div>
                </div>
            </div>

            <PopUp
                isOpen={BookPopUp}
                setIsOpen={setBookPopUp}
                headerText={"Please fill in the following to complete your booking"}
                handleSubmit={handleBooking}
                containsActionButton={ticketCount > 0}
            >
                <TicketCounter
                    pricePerPerson={itinerary.price}
                    maxCount={freeSpots}
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

            <div className="itinerary-info">
                <div className="placeholder">
                    <ItineraryTimeline
                        pickUpLocation={itinerary.pickupLocation}
                        pickUpTime={itinerary.startDate}
                        dropOffLocation={itinerary.dropOffLocation}
                        activities={activities}
                    />
                    {/* pickyp location, pickup time, drop off location, and activity details array */}
                </div>

                <div className="profile-refo-container">
                    <ProfileAndDescription
                        name={tourGuideName || "balabizo"}
                        picture={tourGuidePicture}
                        description={itinerary.description}
                        width={"80%"}
                        // height={"50%"}
                        fontSize={"1.2em"}
                    ></ProfileAndDescription>
                    <div className="refo-container">
                        <div className="accessiblity-tags-reviewssection">
                            <Accessibility
                                accessibilities={itinerary.accessibility}
                                fontSize={"0.8em"}
                            />
                            <Tags tags={itinerary.tags} fontSize={"0.85em"} />
                            <ReviewsSection
                                ratingIds={itinerary.ratings}
                                width={"100%"}
                                fontSize={"12px"}
                            />
                        </div>

                        {/* Done */}
                        <div className="book-availabledates">
                            {/* {(!userType ||
                                userType == "Tourist" ||
                                userType == "Guest") && (
                                <Book
                                    price={itinerary.price}
                                    text={"Likely to be out "}
                                    onClick={() => {
                                        // Open pop up with booking details
                                        if (userType == "Guest" || !userType) {
                                            navigate("/signin");
                                            return;
                                        }
                                        setBookPopUp(true);
                                    }}
                                />
                            )} */}

                            <div>
                                {freeSpots !== undefined && (
                                    <div
                                        style={{
                                            color: "green",
                                            fontWeight: "bold",
                                            marginBottom: "10px",
                                            textAlign: "center", // Optional: Align text to the center
                                        }}
                                    >
                                        {`${freeSpots} Available Seats`}
                                    </div>
                                )}
                                {/* <AvailableDates
                                    date={[itinerary.startDate, itinerary.endDate]}
                                    width="18vw"
                                    fontSize={"0.8em"}
                                /> */}

                                <DateRangeDisplay
                                    startDate={itinerary.startDate}
                                    endDate={itinerary.endDate}
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
                <Button
                    text="Back"
                    stylingMode="always-light"
                    handleClick={() => window.history.back()}
                    customStyle={{ marginBottom: "3vh" }}
                />
                {!hasBookingID && (
                    <Button
                        text="Book"
                        stylingMode="always-dark"
                        handleClick={() => setBookPopUp(true)} // Set popup to open
                        customStyle={{ marginBottom: "3vh" }}
                    />
                )}
            </div>
            {alert.open && (
                <Alert
                    severity={alert.severity}
                    onClose={() => setAlert({ ...alert, open: false })}
                    style={{
                        alignItems: "center",
                        marginTop: "1vh",
                        width: "80vw",
                        marginLeft: "8vw",
                        marginBottom: "2vh",
                        fontSize: "22px",
                        textAlign: "center",
                    }}
                >
                    {alert.message}
                </Alert>
            )}

            <Footer />
        </div>
    );
};

export default ItineraryDetails;
