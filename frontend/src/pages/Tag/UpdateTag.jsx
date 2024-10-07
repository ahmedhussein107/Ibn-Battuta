import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserProfile from "../../components/UserProfile";
import { useParams } from "react-router-dom";

export default function UpdateTag() {
  const { id } = useParams();
  const [tag, setTag] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/tag/getTagByID/${id}`)
      .then((response) => {
        const { _id } = response.data;
        setTag({ _id });
        console.log("Tag:", _id);
      })
      .catch((error) => {
        console.error("Error fetching Tag:", error);
      });
  }, []);

  const handleClick = () => {
    axiosInstance
      .put(`/tag/updateTag/${id}`, tag)
      .then((response) => {
        setResponse("Tag updated successfully!");
      })
      .catch((error) => {
        setResponse("Tag update failed!");
      });
  };

  // Handle deleting the activity
  const handleDelete = () => {
    axiosInstance
      .delete(`/tag/deleteTag/${id}`, tag)
      .then((response) => {
        setResponse("Tag deleted successfully!");
        setTag(null); // Clear the activity data after deletion
      })
      .catch((error) => {
        setResponse("Tag deletion failed!");
      });
  };

  return (
    <div>
      <h1>Tag Page</h1>
      {tag && <UserProfile data={tag} setData={setTag} />}
      <button onClick={handleClick}>Update</button>
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
      {response && <p>{response}</p>}
    </div>
  );
}
