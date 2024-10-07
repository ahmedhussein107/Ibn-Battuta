import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserProfile2 from "../../components/UserProfile2";
import ListOfThings from "../../components/ListOfThings";

export default function GetAllCategories() {
  const categoryId = "stand up comedy";
  const [category, setCategory] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/category/allCategories`)
      .then((response) => {
        const categories = response.data;
        const bte5a = {};
        categories.map(
          (category, index) => (bte5a[`item${index}`] = category._id)
        );
        console.log(bte5a);
        setCategory(bte5a);
        console.log("Category:", categories);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
      });
  }, []);

  //   const handleClick = () => {
  //     axiosInstance
  //       .put(`/category/updateCategory/${categoryId}`, category)
  //       .then((response) => {
  //         setResponse("Category updated successfully!");
  //       })
  //       .catch((error) => {
  //         setResponse("Category update failed!");
  //       });
  //   };

  return (
    <div>
      <h1>Category Page</h1>
      {category && (
        <UserProfile2 data={category} setData={setCategory} path="category" />
      )}
      {response && <p>{response}</p>}
    </div>
  );
}
