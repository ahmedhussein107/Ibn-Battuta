/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function CreateActivityPage() {
  const [formData, setFormData] = useState({
    title: "",
    endDate: "",
    startDate: "",
    time: "",
    location: "",
    price: 0,
    category: "",
    tags: "",
    specialDiscount: "",
    freeSpots: 0,
    isOpenForBooking: false,
    advertiserID: "66ffe6a45d59b2127d80df66",
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Handle checkbox
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    console.log("Contents of FormData:");
    for (let pair of data.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const res = await axiosInstance.post("activity/createActivity", data);
      setResponse("Activity created successfully!");
    } catch (error) {
      console.log(error);
      setResponse("Error creating activity. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Create New Activity</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            placeholder="Activity title"
            onChange={handleChange}
            value={formData.title}
          />
        </div>

        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            onChange={handleChange}
            value={formData.startDate}
          />
        </div>

        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            onChange={handleChange}
            value={formData.endDate}
          />
        </div>

        <div>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            placeholder="Activity Time"
            onChange={handleChange}
            value={formData.time}
          />
        </div>

        <div>
          <label>Location:</label>
          <textarea
            name="location"
            placeholder="Activity Location"
            onChange={handleChange}
            value={formData.location}
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="price"
            name="price"
            placeholder="Activity Price"
            onChange={handleChange}
            value={formData.price}
          />
        </div>

        <div>
          <label>Special Discount:</label>
          <input
            type="price"
            name="specialDiscount"
            placeholder="Activity Special Discounts"
            onChange={handleChange}
            value={formData.specialDiscount}
          />
        </div>

        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            placeholder="Activity Categories"
            onChange={handleChange}
            value={formData.category}
          />
        </div>

        <div>
          <label>Tags:</label>
          <input
            type="text"
            name="tags"
            placeholder="Activity Tags"
            onChange={handleChange}
            value={formData.tags}
          />
        </div>

        <div>
          <label>Free Spots:</label>
          <input
            type="number"
            name="freeSpots"
            placeholder="Free Spots"
            onChange={handleChange}
            value={formData.freeSpots}
          />
        </div>

        <div>
          <label>Open For Booking:</label>
          <input
            type="boolean" // Change type to "checkbox"
            name="isOpenForBooking"
            checked={formData.isOpenForBooking} // Use checked for checkbox
            onChange={handleChange}
          />
        </div>

        <button type="submit">Create Activity</button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
}
