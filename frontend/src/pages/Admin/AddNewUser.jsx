import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    maxWidth: "600px",
    margin: "20px auto",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#007bff",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  message: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "5px",
    color: "#155724",
    backgroundColor: "#d4edda",
    border: "1px solid #c3e6cb",
  },
  errorMessage: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "5px",
    color: "#721c24",
    backgroundColor: "#f8d7da",
    border: "1px solid #f5c6cb",
  },
};

const AddNewUser = () => {
  const [accountType, setAccountType] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [message, setMessage] = useState("");

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
      const uri = `${accountType.toLowerCase()}/create${accountType}`;
      const response = await axiosInstance.post(uri, data);

      if (response.status === 201) {
        setMessage(`${accountType} created successfully.`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Error creating account. Please try again.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New User</h2>
      {!accountType && <p>Please select an account type to add.</p>}
      <select
        defaultValue=""
        onChange={(e) => setAccountType(e.target.value)}
        style={styles.select}
      >
        <option value="" disabled>
          Select User Type
        </option>
        <option value="Admin">Admin</option>
        <option value="Governor">Governor</option>
      </select>

      {accountType && (
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Account Name"
              onChange={handleChange}
              value={formData.name}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              name="username"
              placeholder="User name"
              onChange={handleChange}
              value={formData.username}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Add New User
          </button>
        </form>
      )}
      {message && (
        <p
          style={
            message.includes("Error") ? styles.errorMessage : styles.message
          }
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddNewUser;
