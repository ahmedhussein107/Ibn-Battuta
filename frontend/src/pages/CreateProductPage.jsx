import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const CreateProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    quantity: 1,
    ownerType: "Admin",
    ownerID: "6700d5273d9ef1e85a0f97de",
  });
  const [pictures, setPictures] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log("Selected files:", selectedFiles);
    setPictures(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    for (let i = 0; i < pictures.length; i++) {
      data.append("pictures", pictures[i]);
    }

    console.log("Contents of FormData:");
    for (let pair of data.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
    try {
      const response = await axiosInstance.post("product/createProduct", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product created:", response.data);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div>
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
            value={formData.name}
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            placeholder="Product Price"
            onChange={handleChange}
            value={formData.price}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            placeholder="Product Description"
            onChange={handleChange}
            value={formData.description}
          />
        </div>

        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            onChange={handleChange}
            value={formData.quantity}
          />
        </div>

        <div>
          <label>Pictures:</label>
          <input
            type="file"
            name="pictures"
            multiple
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProductPage;
