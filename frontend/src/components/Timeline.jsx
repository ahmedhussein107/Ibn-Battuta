import React, { useState } from "react";

const Timeline = ({ activities, customActivities, addActivityToTimeline }) => {
    const [selectedActivity, setSelectedActivity] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const handleAddActivity = () => {
        // Find the selected activity details
        const activity = activities.find((activity) => activity._id === selectedActivity);
        const customActivity = customActivities.find(
            (activity) => activity._id === selectedActivity
        );
        if (activity) {
            console.log("Activity found:", activity);
            addActivityToTimeline("Activity", activity, startTime, endTime);
        }
        if (customActivity) {
            console.log("customActivity found:", customActivity);
            addActivityToTimeline("CustomActivity", customActivity, startTime, endTime);
        }
    };

    return (
        <div>
            <h3>Timeline</h3>
            {/* Dropdown for activities */}
            <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
            >
                <option value="" disabled>
                    Select an activity
                </option>
                {activities.map((activity) => (
                    <option key={activity._id} value={activity._id}>
                        {activity.name}
                    </option>
                ))}
                {customActivities.map((activity) => (
                    <option key={activity._id} value={activity._id}>
                        {activity.name} (Custom)
                    </option>
                ))}
            </select>

            {/* Time inputs */}
            <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Start Time"
            />
            <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="End Time"
            />

            <button type="button" onClick={handleAddActivity}>
                Add to Timeline
            </button>
        </div>
    );
};

export default Timeline;
