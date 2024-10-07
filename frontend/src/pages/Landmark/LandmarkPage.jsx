import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserProfile from "../../components/UserProfile";

export default function LandmarkPage() {
    const landmarkId = "6701262d4a2824b86091cdb6";
    const [landmark, setLandmark] = useState(null);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        axiosInstance
            .get(`/landmark/landmark/${landmarkId}`)
            .then((response) => {
                const { _id, __v, createdAt, updatedAt, ..._landmark } =
                    response.data;
                setLandmark(_landmark);
            })
            .catch((error) => {
                console.error("Error fetching landmark:", error);
            });
    }, []);

    const handleUpdateClick = () => {
        axiosInstance
            .patch(`/landmark/updateLandmark/${landmarkId}`, landmark)
            .then((response) => {
                setResponse("Landmark updated successfully!");
            })
            .catch((error) => {
                setResponse("Landmark update failed!");
                console.error(error);
            });
    };

    return (
        <div>
            <h1>Landmark Management Page</h1>
            {landmark && <UserProfile data={landmark} setData={setLandmark} />}
            <button onClick={handleUpdateClick}>Update</button>
            {response && <p>{response}</p>}
        </div>
    );
}
