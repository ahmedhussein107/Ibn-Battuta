import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

// access via http://localhost:5173/update-product/:productId

const UpdateProductPage = () => {
  const { productId } = useParams();
  console.log("productId:", productId);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    quantity: 1,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(
          `product/getProduct/${productId}`
        );
        console.log("this is response:", response.data);
        const product = response.data;
        setFormData({
          name: product.name,
          price: product.price,
          description: product.description,
          quantity: product.quantity,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(
        `product/updateProduct/${productId}`,
        formData
      );
      console.log("Product updated:", response.data);
      // update this navitage to where you want later on
      navigate(`/`); //go to Home for now
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div>
      <h2>Update Product</h2>
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

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProductPage;
