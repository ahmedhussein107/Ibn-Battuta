import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const CreateCategory = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axiosInstance.post(
        "category/createCategory",
        data
      );
      console.log("Category created:", response.data);
    } catch (error) {
      console.error("Error creating Category:", error);
    }
  };

  return (
    <div>
      <h2>Create New tag</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="_id"
            placeholder="Product Name"
            onChange={handleChange}
            value={formData.name}
          />
        </div>

        <button type="submit">Create Category</button>
      </form>
    </div>
  );
};

export default CreateCategory;
