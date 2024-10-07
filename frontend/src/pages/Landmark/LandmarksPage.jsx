import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./Itinerary.css"; // Assuming you add some CSS styling
import { Link } from "react-router-dom";

const LandmarksPage = () => {
    const [items, setItems] = useState([]); // Store the fetched items here
    const [selectedItem, setSelectedItem] = useState(null); // Store the currently selected item
    const [isEditing, setIsEditing] = useState(false); // Manage editing state

    useEffect(() => {
        // Fetch data from the backend when the component mounts
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/landmark/allLandmark");
                const data = response.data;
                setItems(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Handle selecting an item from the list
    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setIsEditing(false); // Reset editing mode
    };

    // Handle editing a specific field
    const handleEditField = (field, value) => {
        setSelectedItem({
            ...selectedItem,
            [field]: value,
        });
    };

    // Handle updating (mock)
    const handleUpdate = async () => {
        const response = await axiosInstance.patch(
            `/landmark/updateLandmark/${selectedItem._id}`,
            selectedItem
        );
        console.log("Item updated:", response.data);
        alert("Item updated successfully!");
    };

    // Handle deleting (mock)
    const handleDelete = async () => {
        const response = await axiosInstance.delete(
            `/landmark/deleteLandmark/${selectedItem._id}`
        );
        console.log("Item deleted:", response.data);
        alert("Item deleted successfully!");
    };

    return (
        <div className="container">
            {/* Left Side: List of Items */}
            <div className="list-container">
                <h2>Items List</h2>
                <ul>
                    {items.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => handleSelectItem(item)}
                            className={
                                selectedItem && selectedItem.id === item.id
                                    ? "list-item active"
                                    : "list-item"
                            }
                        >
                            <h4>{item.name}</h4>
                            <p>{item.description}</p>
                        </li>
                    ))}
                </ul>
                <Link to="/create-landmark">
                    <button> Create new Itinerary</button>
                </Link>
            </div>

            {/* Right Side: Detailed View */}
            <div className="detail-container">
                {selectedItem ? (
                    <div>
                        <h2>Details of {selectedItem.name}</h2>
                        {Object.keys(selectedItem).map(
                            (key) =>
                                key !== "_id" && (
                                    <div className="detail-field" key={key}>
                                        <span className="key">{key}: </span>
                                        {isEditing ? (
                                            <input
                                                value={selectedItem[key]}
                                                onChange={(e) =>
                                                    handleEditField(key, e.target.value)
                                                }
                                            />
                                        ) : (
                                            <span className="value">
                                                {typeof selectedItem[key] === "object" ? (
                                                    <ul>
                                                        {Object.keys(
                                                            selectedItem[key]
                                                        ).map((item) => (
                                                            <div>
                                                                <span className="key">
                                                                    {item}:{" "}
                                                                </span>
                                                                <span className="value">
                                                                    {item[key]}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    selectedItem[key].toString()
                                                )}
                                            </span>
                                        )}
                                    </div>
                                )
                        )}

                        {/* Update and Delete Buttons */}
                        <div className="action-buttons">
                            <button
                                onClick={() =>
                                    isEditing ? handleUpdate() : setIsEditing(true)
                                }
                            >
                                {isEditing ? "Submit" : "Edit"}{" "}
                                {/* Button text toggles between Edit and Submit */}
                            </button>

                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                ) : (
                    <p>Please select an item to view its details</p>
                )}
            </div>
        </div>
    );
};

export default LandmarksPage;
