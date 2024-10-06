import React, { useState } from "react";
import { FaEdit, FaCheck } from "react-icons/fa"; // Import edit/check icons

const SingleEntry = ({ label, initialValue, data, setData }) => {
    const [value, setValue] = useState(initialValue); // State to store the value
    const [isEditing, setIsEditing] = useState(false); // State to track if we're editing

    // Function to toggle edit mode
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    // Handle value change
    const handleValueChange = (e) => {
        setValue(e.target.value);
        const newData = { ...data, [label]: e.target.value };
        console.log(newData);
        setData(newData);
    };

    // Handle saving value on Enter key press
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            setIsEditing(false); // Exit edit mode when Enter is pressed
        }
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

            {/* Toggle edit icon */}
            <span onClick={toggleEditMode} style={styles.icon}>
                {isEditing ? <FaCheck /> : <FaEdit />}{" "}
                {/* Show check icon when editing */}
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

export default SingleEntry;
