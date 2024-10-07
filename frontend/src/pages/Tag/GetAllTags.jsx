import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import UserProfile2 from "../../components/UserProfile2";
import ListOfThings from "../../components/ListOfThings";

export default function GetAllTags() {
  const tagId = "stand up comedy";
  const [tag, setTag] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/tag/allTags`)
      .then((response) => {
        const tags = response.data;
        const bte5a = {};
        tags.map((tag, index) => (bte5a[`item${index}`] = tag._id));
        console.log(bte5a);
        setTag(bte5a);
        console.log("Tag:", tags);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching tag:", error);
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
      <h1>Tag Page</h1>
      {tag && <UserProfile2 data={tag} setData={setTag} path="tag" />}
      {response && <p>{response}</p>}
    </div>
  );
}
