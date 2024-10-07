import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserProfile from "../../components/UserProfile";
import { useParams } from "react-router-dom";

export default function UpdateCategory() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/category/getCategoryByID/${id}`)
      .then((response) => {
        const { _id } = response.data;
        setCategory({ _id });
        console.log("Category:", _id);
      })
      .catch((error) => {
        console.error("Error fetching Category:", error);
      });
  }, []);

  const handleClick = () => {
    axiosInstance
      .put(`/category/updateCategory/${id}`, category)
      .then((response) => {
        setResponse("Category updated successfully!");
      })
      .catch((error) => {
        setResponse("Category update failed!");
      });
  };

  // Handle deleting the activity
  const handleDelete = () => {
    axiosInstance
      .delete(`/category/deleteCategory/${id}`, category)
      .then((response) => {
        setResponse("Category deleted successfully!");
        setCategory(null); // Clear the activity data after deletion
      })
      .catch((error) => {
        setResponse("Category deletion failed!");
      });
  };

  return (
    <div>
      <h1>Category Page</h1>
      {category && <UserProfile data={category} setData={setCategory} />}
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
