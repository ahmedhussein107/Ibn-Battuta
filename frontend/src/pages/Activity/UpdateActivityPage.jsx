/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserProfile from "../../components/UserProfile";

export default function UpdateActivityPage() {
  const activityId = "670109d5ff4d3b94c2d294a9";
  const [activity, setActivity] = useState(null);
  const [response, setResponse] = useState(null);

  // Fetch activity details
  useEffect(() => {
    axiosInstance
      .get(`/activity/getActivity/${activityId}`)
      .then((response) => {
        const { _id, ...activityData } = response.data;
        setActivity(activityData);
        console.log("activity:", activityData);
      })
      .catch((error) => {
        console.error("Error fetching activity:", error);
      });
  }, []);

  // Handle updating the activity
  const handleUpdate = () => {
    axiosInstance
      .patch(`/activity/updateActivity/${activityId}`, activity)
      .then((response) => {
        setResponse("Activity updated successfully!");
      })
      .catch((error) => {
        setResponse("Activity update failed!");
      });
  };

  // Handle deleting the activity
  const handleDelete = () => {
    axiosInstance
      .delete(`/activity/deleteActivity/${activityId}`)
      .then((response) => {
        setResponse("Activity deleted successfully!");
        setActivity(null); // Clear the activity data after deletion
      })
      .catch((error) => {
        setResponse("Activity deletion failed!");
      });
  };

  return (
    <div>
      <h1>Update or Delete Activity</h1>
      {activity && (
        <div>
          <UserProfile data={activity} setData={setActivity} />
          <button onClick={handleUpdate}>Update</button>
          <button
            onClick={handleDelete}
            style={{
              marginLeft: "10px",
              backgroundColor: "red",
              color: "white",
            }}
          >
            Delete
          </button>
        </div>
      )}
      {response && <p>{response}</p>}
    </div>
  );
}
