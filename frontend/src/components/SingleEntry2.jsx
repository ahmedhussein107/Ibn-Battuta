import React, { useState } from "react";
import { FaEdit, FaCheck } from "react-icons/fa"; // Import edit/check icons
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const SingleEntry2 = ({ label, initialValue, data, setData, path }) => {
  const [value, setValue] = useState(initialValue); // State to store the value
  const oldData = data; // State to store the value
  const [isEditing, setIsEditing] = useState(false); // State to track if we're editing
  const navigate = useNavigate(); // Hook to navigate to another page

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Handle value change
  const handleValueChange = (e) => {
    setValue(e.target.value);
    const newData = { ...data, [label]: e.target.value };
    setData(newData);
  };

  // Handle saving value on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false); // Exit edit mode when Enter is pressed
    }
  };

  // Function to handle navigation when the icon is clicked
  const handleNavigate = (value) => {
    // Redirect to /update-tag (or any route you defined)
    navigate(`/${path}/${value}`);
  };

  return (
    <div style={styles.row}>
      <label style={styles.label}>{label}:</label>

      {/* Display either input field (if editing) or the value */}
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={handleValueChange}
          onKeyPress={handleKeyPress}
          style={styles.inputBox}
        />
      ) : (
        <span style={styles.valueBox}>{value}</span>
      )}

      {/* Add the new icon button for navigation */}
      <span onClick={() => handleNavigate(initialValue)} style={styles.icon}>
        <FaEdit /> {/* Replace this icon with any icon of your choice */}
      </span>
    </div>
  );
};

// Basic inline styles for the component
const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  label: {
    width: "22vh",
    fontWeight: "bold",
    alignItems: "center",
  },
  valueBox: {
    flex: 1,
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
  },
  inputBox: {
    flex: 1,
    padding: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
  },
  icon: {
    marginLeft: "10px",
    cursor: "pointer",
    fontSize: "1.2em",
  },
};

export default SingleEntry2;
