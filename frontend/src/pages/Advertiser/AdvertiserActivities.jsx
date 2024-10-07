/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import ObjectList from "../../components/ListOfObjects";

const AdvertiserActivities = () => {
  const advertiserId = "67040377731df0ac20353236";
  const [activity, setLandmarks] = useState([]);
  const [tags, setTags] = useState([]); // To store all unique tags
  const [selectedTag, setSelectedTag] = useState(""); // For the dropdown
  const [response, setResponse] = useState("");

  // Fetch all landmarks initially to get the available tags
  useEffect(() => {
    axiosInstance
      .get(`/activity/getAdvertiserActivities/${advertiserId}`)
      .then((response) => {
        const getAdvertiserActivities = response.data;
        setLandmarks(getAdvertiserActivities);
        setResponse("activity fetched successfully");

        // Extract unique tags from the landmarks
        const allTags = [
          ...new Set(
            getAdvertiserActivities.flatMap((activity) => activity.tags || [])
          ),
        ];
        if (allTags.length === 0) {
          console.warn("No tags found in the activity data.");
        }
        setTags(allTags); // Set tags for the dropdown
      })
      .catch((error) => {
        setResponse("Error fetching activity");
        console.error("Error fetching activity:", error);
      });
  }, []);

  return (
    <div>
      <h1>Advertiser's activity</h1>
      {/* Display filtered landmarks */}
      {activity && <ObjectList data={activity} />}
      {response && <p>{response}</p>}
    </div>
  );
};

export default AdvertiserActivities;
