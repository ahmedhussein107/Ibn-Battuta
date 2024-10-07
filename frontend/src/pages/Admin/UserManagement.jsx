import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import ConfirmationDialog from "../../components/ConfirmationDialog"; // Import the ConfirmationDialog component

const UserManagement = () => {
  const [userType, setUserType] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Track dialog state
  const [selectedUserID, setSelectedUserID] = useState(null); // Track selected user ID

  useEffect(() => {
    if (userType) {
      fetchUsers(userType);
    }
  }, [userType]);

  const fetchUsers = async (type) => {
    try {
      const uri = `${type.toLowerCase()}/get${type}s`;
      const response = await axiosInstance.get(uri);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Error fetching users. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const uri = `${userType.toLowerCase()}/delete${userType}/${selectedUserID}`;
      await axiosInstance.delete(uri);
      setMessage("User deleted successfully!");
      setUsers(users.filter((user) => user._id !== selectedUserID));
      setIsDialogOpen(false); // Close the dialog after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Error deleting user. Please try again.");
    }
  };

  // Open the confirmation dialog and store the selected user ID
  const openConfirmationDialog = (userID) => {
    setSelectedUserID(userID);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <h2>User Management</h2>
      <select
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        style={{ marginBottom: "20px", padding: "10px" }}
      >
        <option value="">Select User Type</option>
        <option value="Governor">Governor</option>
        <option value="TourGuide">Tour Guide</option>
        <option value="Tourist">Tourist</option>
        <option value="Seller">Seller</option>
        <option value="Advertiser">Advertiser</option>
      </select>
      {userType && <h3>Displaying {userType} Accounts</h3>}
      {message && <p>{message}</p>}

      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {users.length > 0 ? (
          users.map((user) => (
            <li
              key={user._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ccc",
              }}
            >
              <span>
                <strong>Username:</strong> {user.username} |{" "}
                <strong>Email:</strong> {user.email}
              </span>
              <button
                onClick={() => openConfirmationDialog(user._id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px 10px",
                }}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No users available for the selected type.</p>
        )}
      </ul>

      {/* Confirmation Dialog for Deleting User */}
      <ConfirmationDialog
        message="Are you sure you want to delete this user?"
        onConfirm={handleDelete}
        onCancel={() => setIsDialogOpen(false)}
        isOpen={isDialogOpen}
      />
    </div>
  );
};

export default UserManagement;
