// src/pages/Tag/fetchAllTags.js
import axiosInstance from "../../api/axiosInstance";

export const fetchAllTags = async () => {
  try {
    const response = await axiosInstance.get("/tag/allTags");
    const tag = response.data;
    const formattedTags = {};

    tag.forEach((tag, index) => {
      formattedTags[`item${index}`] = tag._id;
    });

    return formattedTags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return null;
  }
};
