import React, { useEffect, useState, useParams } from "react";

import Step1 from "../../components/Itinerary/Step1";
import Step2 from "../../components/Itinerary/Step2";

import itineraries from "../../assets/backgrounds/itineraries.png";
import axiosInstance from "../../api/axiosInstance";
import Footer from "../../components/Footer";

const CreateItineraryPage = ({ isEdit = false }) => {
    const [step, setStep] = useState(2); // TODO: step1 should be the default
    const [timelineActivities, setTimelineActivities] = useState([]);

    const itineraryId = isEdit ? useParams().itineraryId : null;

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
                    console.log("resolvedActivities", resolvedActivities);
                    setTimelineActivities(resolvedActivities);
                } catch (error) {
                    console.error("Error fetching itinerary:", error);
                }
            };

            fetchItinerary();
        }
    }, []);

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
                />
            )}
            {step === 2 && (
                <Step2
                    setStep={setStep}
                    convertedDate={new Date()}
                    timelineActivities={timelineActivities}
                    setTimelineActivities={setTimelineActivities}
                />
            )}
            <Footer />
        </div>
    );
};

export default CreateItineraryPage;
