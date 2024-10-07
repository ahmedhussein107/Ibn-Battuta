import React, { useState, useEffect } from "react";
import ItineraryForm from "../../components/ItineraryForm";
import axiosInstance from "../../api/axiosInstance";

const CreateItineraryPage = () => {
    const [activities, setActivities] = useState([]);
    const [customActivities, setCustomActivities] = useState([]);
    const tourGuideId = "6700044e887e126c909d6f21";
    const [data, setData] = useState(null);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const allActivities = await axiosInstance.get("/activity/getAllActivties");
            console.log("allActivities:", allActivities);
            setActivities(allActivities.data);

            const allCustomActivities = await axiosInstance.get(
                `/customActivity/getCustomActivityByTourGuideId/${tourGuideId}`
            );
            console.log("allCustomActivities:", allCustomActivities);
            setCustomActivities(allCustomActivities.data);
        };

        getData();
    }, []);

    const createItinerary = async () => {
        try {
            const response = await axiosInstance.post("/itinerary/createItinerary", data);
            console.log("response:", response);
            setResponse("Itinerary created successfully!");
        } catch (error) {
            console.error("Error creating itinerary:", error);
            setResponse("Error creating itinerary. Please try again later.");
        }
    };

    return (
        <div>
            <h1>Create Itinerary</h1>
            <ItineraryForm
                activities={activities}
                customActivities={customActivities}
                data={data}
                setData={setData}
                createItinerary={createItinerary}
                tourguideID={tourGuideId}
            />
            {response && <p>{response}</p>}
        </div>
    );
};

export default CreateItineraryPage;
