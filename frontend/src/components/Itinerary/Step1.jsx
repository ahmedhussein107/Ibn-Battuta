import React from "react";
import Timeline from "../Timeline";

const Step1 = ({ setStep, timelineActivities, setTimelineActivities }) => {
    const date = new Date();
    return (
        <Timeline
            timelineActivities={timelineActivities}
            setTimelineActivities={setTimelineActivities}
            pickupLocation="pickup location"
            pickupTime={date}
            dropOffLocation="drop off location"
        />
    );
};

export default Step1;
