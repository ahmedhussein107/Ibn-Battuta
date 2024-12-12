import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import Step1 from "../../components/Itinerary/Step1";
import Step2 from "../../components/Itinerary/Step2";

import itineraries from "../../assets/backgrounds/itineraries.png";
import axiosInstance from "../../api/axiosInstance";
import Footer from "../../components/Footer";

import { useCurrencyConverter } from "../../hooks/currencyHooks.js";
import { useNavigate, useParams } from "react-router-dom";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PopupContainer = styled.div`
    position: fixed;
    bottom: 1%;
    right: 1%;
    z-index: 1000;
    animation: ${fadeIn} 0.3s ease;
    background-color: ${({ isError }) => (isError ? "#f8d7da" : "#d4edda")};
`;

const PopupContent = styled.div`
    color: ${({ isError }) => (isError ? "#721c24" : "#155724")};
    padding: 1em 1.5em;
    border-radius: 0.25em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1em;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: inherit;
    font-size: 1.2em;
    cursor: pointer;
`;

const Popup = ({ message, onClose, isError }) => (
    <PopupContainer isError={isError}>
        <PopupContent>
            {message}
            <CloseButton onClick={onClose}>×</CloseButton>
        </PopupContent>
    </PopupContainer>
);

const CreateItineraryPage = ({ isEdit = false }) => {
    const [step, setStep] = useState(1); // TODO: step1 should be the default
    const [timelineActivities, setTimelineActivities] = useState([]);

    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [isErrorPopup, setIsErrorPopup] = useState(false);

    const showPopupMessage = (message, isError) => {
        setPopupMessage(message);
        setIsErrorPopup(isError);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 1500);
    };

    const itineraryId = isEdit ? useParams().itineraryId : null;

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [pickupLocation, setPickupLocation] = useState({
        latitude: 0,
        longitude: 0,
        location: "",
    });
    const [dropoffLocation, setDropoffLocation] = useState({
        latitude: 0,
        longitude: 0,
        location: "",
    });
    const [startDate, setStartDate] = useState(null);
    const [tags, setTags] = useState([]);
    const [accessibility, setAccessibility] = useState([]);
    const [language, setLanguage] = useState("");

    const [currency, setCurrency] = useState("EGP");

    const [formattedDate, setFormattedDate] = useState("");
    const [formattedTime, setFormattedTime] = useState("");

    const { convertPrice } = useCurrencyConverter();

    useEffect(() => {
        let totalPrice = convertPrice(price, "EGP", currency);
        let picture = "https://cdn-icons-png.flaticon.com/512/7603/7603006.png";
        timelineActivities.forEach((activity) => {
            if (activity.activityType === "Activity") {
                totalPrice += Number(activity.activity.price);
                if (activity.activity.picture) {
                    picture = activity.activity.picture;
                }
            }
        });
        const itineraryData = {
            name,
            activities: timelineActivities,
            price: totalPrice,
            description,
            pickuplongitude: pickupLocation.longitude,
            pickuplatitude: pickupLocation.latitude,
            pickupLocation: pickupLocation.location,
            dropOfflongitude: dropoffLocation.longitude,
            dropOfflatitude: dropoffLocation.latitude,
            dropOffLocation: dropoffLocation.location,
            startDate, // TODO: convert to ISODate()
            endDate: timelineActivities[timelineActivities.length - 1]?.endTime,
            tags,
            accessibility: accessibility.join(","),
            language,
            picture,
        };

        console.log("itineraryData", itineraryData);
    }, [
        name,
        price,
        description,
        pickupLocation,
        dropoffLocation,
        startDate,
        tags,
        accessibility,
        language,
    ]);

    useEffect(() => {
        if (itineraryId) {
            // fetch itinerary data and set them
            const fetchItinerary = async () => {
                try {
                    const response = await axiosInstance.get(
                        `/itinerary/getItinerary/${itineraryId}`
                    );
                    const itinerary = response.data;

                    const activities = itinerary.activities.map(async (activity) => {
                        const type = activity.activityType;
                        let activityDate = null;
                        if (type === "Activity") {
                            activityDate = await axiosInstance.get(
                                `/activity/getActivity/${activity.activity}`
                            );
                        } else {
                            activityDate = await axiosInstance.get(
                                `/customActivity/getCustomActivity/${activity.activity}`
                            );
                        }
                        return {
                            activityType: type,
                            activity: activityDate.data,
                            startTime: new Date(activity.startTime),
                            endTime: new Date(activity.endTime),
                        };
                    });

                    const resolvedActivities = await Promise.all(activities);
                    setTimelineActivities(resolvedActivities);

                    // Set other state variables based on the fetched itinerary
                    setName(itinerary.name);
                    setPrice(convertPrice(itinerary.price, "EGP", itinerary.currency));
                    setDescription(itinerary.description);

                    setPickupLocation({
                        latitude: itinerary.pickuplatitude,
                        longitude: itinerary.pickuplongitude,
                        location: itinerary.pickupLocation,
                    });

                    setDropoffLocation({
                        latitude: itinerary.dropOfflatitude,
                        longitude: itinerary.dropOfflongitude,
                        location: itinerary.dropoffLocation,
                    });

                    setStartDate(new Date(itinerary.startDate));
                    setTags(itinerary.tags.split(","));
                    setAccessibility(itinerary.accessibility.split(","));
                    setLanguage(itinerary.language);
                    setCurrency(itinerary.currency);
                    setFormattedDate(itinerary.startDate.toLocaleDateString());

                    function formatTime12Hour(date) {
                        const hours = date.getHours(); // Get hours in 24-hour format
                        const minutes = date.getMinutes(); // Get minutes
                        const period = hours >= 12 ? "PM" : "AM"; // Determine AM or PM

                        // Convert hours to 12-hour format
                        const hours12 = hours % 12 || 12; // Replace 0 with 12 for midnight

                        // Ensure minutes are two digits
                        const formattedMinutes = minutes.toString().padStart(2, "0");

                        return `${hours12}:${formattedMinutes} ${period}`;
                    }

                    setFormattedTime(formatTime12Hour(itinerary.startDate));
                } catch (error) {
                    console.error("Error fetching itinerary:", error);
                }
            };

            fetchItinerary();
        }
    }, []);

    const [processing, setProcessing] = useState(false);

    const handleSubmit = async () => {
        let totalPrice = convertPrice(price, currency, "EGP");
        let picture = "https://cdn-icons-png.flaticon.com/512/7603/7603006.png";

        setProcessing(true);

        timelineActivities.forEach((activity) => {
            if (activity.activityType === "Activity") {
                totalPrice += Number(activity.activity.price);
                if (activity.activity.pictures && activity.activity.pictures.length > 0) {
                    picture = activity.activity.pictures[0];
                }
            }
        });

        const endDate =
            timelineActivities.length === 0
                ? startDate
                : timelineActivities[timelineActivities.length - 1].endTime;

        const itineraryData = {
            name,
            activities: timelineActivities,
            price: totalPrice,
            description,
            pickuplongitude: pickupLocation.longitude,
            pickuplatitude: pickupLocation.latitude,
            pickupLocation: pickupLocation.location,
            dropOfflongitude: dropoffLocation.longitude,
            dropOfflatitude: dropoffLocation.latitude,
            dropOffLocation: dropoffLocation.location,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            tags: tags.join(","),
            accessibility: accessibility.join(","),
            language,
            picture,
        };

        console.log("itineraryData", itineraryData);

        if (isEdit) {
            const response = await axiosInstance.patch(
                "/itinerary/updateItinerary/" + itineraryId,
                { ...itineraryData }
            );
        } else {
            const response = await axiosInstance.post(
                "/itinerary/createItinerary",
                { ...itineraryData },
                { withCredentials: true }
            );
        }

        setProcessing(false);
        navigate("/tourguide/assigned");
    };

    return (
        <div
            style={{
                position: "absolute",
                top: "0",
                left: "0",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {showPopup && (
                <Popup
                    message={popupMessage}
                    onClose={() => setShowPopup(false)}
                    isError={isErrorPopup}
                />
            )}
            <div
                style={{
                    width: "100vw",
                    height: "35vh",
                    color: "#FAE2B6",
                    backgroundImage: `url(${itineraries})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                <div style={{ marginBottom: "2%" }}>
                    <p
                        style={{
                            fontSize: "2.5rem",
                            marginBottom: "1rem",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                            color: "white",
                            fontWeight: "bold",
                            userSelect: "none",
                        }}
                    >
                        Create a new Itinerary
                    </p>
                </div>
            </div>
            {step === 1 && (
                <Step1
                    setStep={setStep}
                    timelineActivities={timelineActivities}
                    setTimelineActivities={setTimelineActivities}
                    name={name}
                    setName={setName}
                    price={price}
                    setPrice={setPrice}
                    description={description}
                    setDescription={setDescription}
                    pickupLocation={pickupLocation}
                    setPickupLocation={setPickupLocation}
                    dropoffLocation={dropoffLocation}
                    setDropoffLocation={setDropoffLocation}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    tags={tags}
                    setTags={setTags}
                    accessibility={accessibility}
                    setAccessibility={setAccessibility}
                    language={language}
                    setLanguage={setLanguage}
                    handleSubmit={handleSubmit}
                    currency={currency}
                    setCurrency={setCurrency}
                    formattedDate={formattedDate}
                    setFormattedDate={setFormattedDate}
                    formattedTime={formattedTime}
                    setFormattedTime={setFormattedTime}
                    showPopupMessage={showPopupMessage}
                    processing={processing}
                />
            )}
            {step === 2 && (
                <Step2
                    setStep={setStep}
                    convertedDate={startDate}
                    timelineActivities={timelineActivities}
                    setTimelineActivities={setTimelineActivities}
                />
            )}
            <Footer />
        </div>
    );
};

export default CreateItineraryPage;
