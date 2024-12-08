/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import ObjectList from "../../components/ListOfObjects";

const Landmark = () => {
  const [landmarks, setLandmarks] = useState([]);
  const [tags, setTags] = useState([]); // To store all unique tags
  const [selectedTag, setSelectedTag] = useState(""); // For the dropdown
  const [response, setResponse] = useState("");

  // Fetch all landmarks initially to get the available tags
  useEffect(() => {
    axiosInstance
      .get(`/landmark/filterLandmarks`)
      .then((response) => {
        const allLandmarks = response.data;
        setLandmarks(allLandmarks);
        setResponse("Landmarks fetched successfully");

        // Extract unique tags from the landmarks
        const allTags = [
          ...new Set(allLandmarks.flatMap((landmark) => landmark.tags || [])),
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

  // Call the backend to filter landmarks by selected tag
  const filterLandmarks = async (selectedTag) => {
    try {
      const response = await axiosInstance.get("/landmark/filterLandmarks", {
        params: { tags: selectedTag }, // Pass the selected tag as a query parameter
      });

      console.log("Selected Tag(s):", selectedTag);
      console.log("Response Data:", response.data);

      // If selectedTag is null, undefined, or empty, return all landmarks
      if (!selectedTag || selectedTag.length === 0) {
        setLandmarks(response.data); // No filtering, return all landmarks
        setResponse("All landmarks returned (no filtering)");
        return;
      }

      // Ensure selectedTag is an array
      const selectedTagsArray = Array.isArray(selectedTag)
        ? selectedTag
        : [selectedTag];

      // Assuming landmarks in response.data have a tags array
      const filteredLandmarks = response.data.filter((landmark) => {
        if (!Array.isArray(landmark.tags)) {
          console.warn(
            "Landmark does not have a valid 'tags' array:",
            landmark
          );
          return false;
        }

        // Filter landmarks based on tag match
        console.log("Selected Tags Array:", selectedTagsArray);
        return selectedTagsArray.some((tag) => landmark.tags.includes(tag));
      });

      console.log("Filtered Landmarks:", filteredLandmarks);

      setLandmarks(filteredLandmarks); // Update landmarks based on the filtered result
      setResponse("Landmarks filtered successfully");
    } catch (error) {
      setResponse("Error filtering landmarks");
      console.error("Error filtering landmarks:", error);
    }
  };

  // Handle tag selection and call the filter API
  const handleTagChange = (e) => {
    const tag = e.target.value;
    setSelectedTag(tag);
    filterLandmarks(tag); // Trigger filtering based on selected tag
  };

  const chooseFields = (landmarks) => {
    return landmarks.map((landmark) => {
      const {
        governerID,
        pictures,
        createdAt,
        updatedAt,
        __v,
        _id,
        id,
        rating,
        ...rest
      } = landmark;
      return {
        // Governer: governerID.name,
        ...rest,
      };
    });
  };
  return (
    <div>
      <h1>Filter Landmarks</h1>

      {/* Dropdown for filtering by tags */}
      <label htmlFor="tag-filter">Filter by Tag:</label>
      <select id="tag-filter" value={selectedTag} onChange={handleTagChange}>
        <option value="">All Tags</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      {/* Display filtered landmarks */}
      {landmarks && <ObjectList data={chooseFields(landmarks)} />}
      {response && <p>{response}</p>}
    </div>
  );
};

export default Landmark;
