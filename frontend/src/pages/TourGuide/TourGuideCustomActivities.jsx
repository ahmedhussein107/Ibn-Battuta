/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import ObjectList from "../../components/ListOfObjects";

const TourGuideCustomActivities = () => {
  const tourguideId = "6700044e887e126c909d6f21";
  const [customActivity, setLandmarks] = useState([]);
  const [tags, setTags] = useState([]); // To store all unique tags
  const [selectedTag, setSelectedTag] = useState(""); // For the dropdown
  const [response, setResponse] = useState("");

  // Fetch all landmarks initially to get the available tags
  useEffect(() => {
    axiosInstance
      .get(`/customActivity/getCustomActivityByTourGuideId/${tourguideId}`)
      .then((response) => {
        const getCustomActivityByTourGuideId = response.data;
        setLandmarks(getCustomActivityByTourGuideId);
        setResponse("customActivity fetched successfully");

        // Extract unique tags from the landmarks
        const allTags = [
          ...new Set(
            getCustomActivityByTourGuideId.flatMap(
              (customActivity) => customActivity.tags || []
            )
          ),
        ];
        if (allTags.length === 0) {
          console.warn("No tags found in the customActivity data.");
        }
        setTags(allTags); // Set tags for the dropdown
      })
      .catch((error) => {
        setResponse("Error fetching itinerery");
        console.error("Error fetching customActivity:", error);
      });
  }, []);

  return (
    <div>
      <h1>Tour Guide's customActivity</h1>
      {/* Display filtered landmarks */}
      {customActivity && <ObjectList data={customActivity} />}
      {response && <p>{response}</p>}
    </div>
  );
};

export default TourGuideCustomActivities;
