/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import ObjectList from "../../components/ListOfObjects";

const governorLandmark = () => {
  const governorId = "67012b5d35a855937cb9625f";
  const [landmarks, setLandmarks] = useState([]);
  const [tags, setTags] = useState([]); // To store all unique tags
  const [selectedTag, setSelectedTag] = useState(""); // For the dropdown
  const [response, setResponse] = useState("");

  // Fetch all landmarks initially to get the available tags
  useEffect(() => {
    axiosInstance
      .get(`/landmark/getGovernorLandmarks/${governorId}`)
      .then((response) => {
        const getGovernorLandmarks = response.data;
        setLandmarks(getGovernorLandmarks);
        setResponse("Landmarks fetched successfully");

        // Extract unique tags from the landmarks
        const allTags = [
          ...new Set(
            getGovernorLandmarks.flatMap((landmark) => landmark.tags || [])
          ),
        ];
        if (allTags.length === 0) {
          console.warn("No tags found in the landmarks data.");
        }
        setTags(allTags); // Set tags for the dropdown
      })
      .catch((error) => {
        setResponse("Error fetching landmarks");
        console.error("Error fetching landmarks:", error);
      });
  }, []);

  return (
    <div>
      <h1>all Landmarks</h1>
      {/* Display filtered landmarks */}
      {landmarks && <ObjectList data={landmarks} />}
      {response && <p>{response}</p>}
    </div>
  );
};

export default governorLandmark;
