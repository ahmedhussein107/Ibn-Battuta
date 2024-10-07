import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserProfile from "../../components/UserProfile";

export default function LandmarkPage() {
  const landmarkId = "670428df15a214475138ef8a"; // Hardcoded landmark ID for demo
  const [landmark, setLandmark] = useState(null); // To store fetched landmark data
  const [response, setResponse] = useState(""); // For showing success/error messages
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For handling errors

  // Fetch landmark data on component mount
  useEffect(() => {
    axiosInstance
      .get(`landmark/landmark/${landmarkId}`)
      .then((response) => {
        const { _id, __v, createdAt, updatedAt, ..._landmark } = response.data;
        setLandmark(_landmark);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching landmark:", error);
        setError("Error fetching landmark data.");
        setLoading(false);
      });
  }, [landmarkId]);

  // Handle landmark update
  const handleUpdateClick = () => {
    axiosInstance
      .patch(`landmark/updateLandmark/${landmarkId}`, landmark)
      .then((response) => {
        setResponse("Landmark updated successfully!");
      })
      .catch((error) => {
        setResponse("Landmark update failed!");
        console.error("Error updating landmark:", error);
      });
  };

  // Conditional rendering based on loading and error state
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Landmark Management Page</h1>
      {/* Display UserProfile form only if landmark data is available */}
      {landmark && (
        <>
          <UserProfile data={landmark} setData={setLandmark} />
          <button onClick={handleUpdateClick}>Update</button>
        </>
      )}
      {/* Show response message (success or error) */}
      {response && <p>{response}</p>}
    </div>
  );
}
