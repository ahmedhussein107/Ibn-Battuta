import React, { useState } from "react";
import Timeline from "../Timeline";
import MyForm from "../MyForm";

const Step1 = ({ setStep, timelineActivities, setTimelineActivities }) => {
    const [formData, setFormData] = useState({});
    const date = new Date();
    return (
        <div
            style={{
                width: "90%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
            }}
        >
            <MyForm />
            <Timeline
                timelineActivities={timelineActivities}
                setTimelineActivities={setTimelineActivities}
                pickupLocation="pickup location"
                pickupTime={date}
                dropOffLocation="drop off location"
            />
        </div>
    );
};

export default Step1;
