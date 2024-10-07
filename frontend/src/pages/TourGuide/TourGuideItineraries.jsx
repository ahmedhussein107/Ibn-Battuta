/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import ObjectList from "../../components/ListOfObjects";

const tourguidItinerary = () => {
  const tourguideId = "6700044e887e126c909d6f21";
  const [itinerary, setLandmarks] = useState([]);
  const [tags, setTags] = useState([]); // To store all unique tags
  const [selectedTag, setSelectedTag] = useState(""); // For the dropdown
  const [response, setResponse] = useState("");

  // Fetch all landmarks initially to get the available tags
  useEffect(() => {
    axiosInstance
      .get(`/itinerary/getTourGuideItinerary/${tourguideId}`)
      .then((response) => {
        const getTourGuideItinerary = response.data;
        setLandmarks(getTourGuideItinerary);
        setResponse("Itinerary fetched successfully");

        // Extract unique tags from the landmarks
        const allTags = [
          ...new Set(
            getTourGuideItinerary.flatMap((itinerary) => itinerary.tags || [])
          ),
        ];
        if (allTags.length === 0) {
          console.warn("No tags found in the itinerary data.");
        }
        setTags(allTags); // Set tags for the dropdown
      })
      .catch((error) => {
        setResponse("Error fetching itinerery");
        console.error("Error fetching itinerary:", error);
      });
  }, []);

  return (
    <div>
      <h1>Tour Guide's Itinerary</h1>
      {/* Display filtered landmarks */}
      {itinerary && <ObjectList data={itinerary} />}
      {response && <p>{response}</p>}
    </div>
  );
};

export default tourguidItinerary;
