/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import bg from "../../assets/images/bg.jpg";
import ProfileButton from "../../components/ProfileButtons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUpsGeneric/PopUp";

const AdminProfilePage = () => {
    const [response, setResponse] = useState(null);
    const [userType, setUserType] = useState("Admin");
    const [isEditing, setIsEditing] = useState(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", username: "", email: "" });
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance
            .get("/admin/getAdminById", { withCredentials: true })
            .then((response) => {
                setResponse(response.data);
                setFormData({
                    name: response.data.name,
                    username: response.data.username,
                    email: response.data.email,
                });
            })
            .catch((error) => {
                console.error("Error fetching Admin:", error);
            });
    }, []);

    const handleEditProfileSubmit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        // Check if formData has been changed compared to the original response
        if (
            formData.name !== response.name ||
            formData.username !== response.username ||
            formData.email !== response.email
        ) {
            axiosInstance
                .put("/admin/updateAdmin", formData, { withCredentials: true })
                .then((response) => {
                    setResponse(response.data);
                    setIsEditing(false);
                    alert("Profile updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                });
        } else {
            // No changes made; you could also log a message or do nothing
            setIsEditing(false);
            console.log("No changes to save");
        }
    };

    const handleDeleteAccountSubmit = () => {
        axiosInstance
            .delete("/admin/deleteAdmin", { withCredentials: true })
            .then(() => {
                alert("Admin account deleted successfully");
                Cookies.remove("userType");
                setUserType("Guest");
                navigate("/");
            })
            .catch((error) => {
                console.error("Error deleting Admin account:", error);
            });
    };

    const handleChangePassword = () => {
        setIsPopUpOpen(true);
    };

    const PopUpAction = () => {
        setIsPopUpOpen(false);
    };

    return (
        <>
            <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
                <div
                    style={{
                        width: "100vw",
                        height: "30vh",
                        backgroundImage: `url(${bg})`,
                        backgroundSize: "100% 100%",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                ></div>
                <div
                    style={{
                        width: "10vw",
                        height: "10vw",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "4px solid white",
                        marginTop: "-5vw",
                        marginLeft: "45%",
                        backgroundImage:
                            "url(https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                ></div>
                <div>
                    {isEditing ? (
                        <h2
                            style={{
                                marginTop: "-1vw",
                                marginLeft: "42%",
                                padding: "1vw",
                            }}
                        >
                            <div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </h2>
                    ) : (
                        <h2
                            style={{
                                marginTop: "-1vw",
                                marginLeft: "43%",
                                padding: "1vw",
                            }}
                        >
                            {response?.name || "name not provided"}
                        </h2>
                    )}
                    <p style={{ color: "gray", marginTop: "-3vw", marginLeft: "47%" }}>
                        @{response?.username || "username not provided"}
                    </p>
                    <hr
                        style={{
                            width: "90%",
                            borderTop: "2px solid #ccc",
                            marginTop: "-1vw",
                        }}
                    />
                    <div
                        style={{
                            width: "60%",
                            textAlign: "left",
                            marginTop: "-2vw",
                            padding: "3vw",
                        }}
                    >
                        <h3>Profile Details</h3>
                        <p>
                            <strong>Email:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            ) : (
                                response?.email || "No email provided"
                            )}
                        </p>
                    </div>
                </div>
                <div>
                    <ProfileButton
                        buttonType="changePassword"
                        onClick={() => handleChangePassword()}
                    />
                    <PopUp
                        isOpen={isPopUpOpen}
                        setIsOpen={setIsPopUpOpen}
                        headerText={"Change Password"}
                        actionText={"Confirm"}
                        handleSubmit={PopUpAction}
                    >
                        <label>Current Password:</label>
                        <input
                            type="password"
                            name="Current Password"
                            placeholder="Current Password"
                            onChange={handleChange}
                            style={{
                                width: "80%", // Full width
                                padding: "1vw", // Padding for better spacing
                                marginBottom: "1vw", // Space between inputs
                                border: "1px solid #ccc", // Border style
                                borderRadius: "4px", // Rounded corners
                                alignItems: "center", // Align text to center
                            }}
                        />
                        <label>New Password:</label>
                        <input
                            type="password"
                            name="New Password"
                            placeholder="Current Password"
                            onChange={handleChange}
                            style={{
                                width: "80%", // Full width
                                padding: "1vw", // Padding for better spacing
                                marginBottom: "1vw", // Space between inputs
                                border: "1px solid #ccc", // Border style
                                borderRadius: "4px", // Rounded corners
                            }}
                        />
                        <label>Confirm New Password:</label>
                        <input
                            type="password"
                            name="Confirm New Password"
                            placeholder="Current Password"
                            onChange={handleChange}
                            style={{
                                width: "80%", // Full width
                                padding: "1vw", // Padding for better spacing
                                marginBottom: "1vw", // Space between inputs
                                border: "1px solid #ccc", // Border style
                                borderRadius: "4px", // Rounded corners
                            }}
                        />
                    </PopUp>

                    <ProfileButton
                        buttonType="deleteAccount"
                        onClick={handleDeleteAccountSubmit}
                    />
                    {isEditing ? (
                        <ProfileButton
                            buttonType="saveProfile"
                            onClick={handleSaveChanges}
                        />
                    ) : (
                        <ProfileButton
                            buttonType="editProfile"
                            onClick={handleEditProfileSubmit}
                        />
                    )}
                </div>
            </div>
            <div style={{ position: "fixed", top: 0, left: "9%" }}>
                <Navbar />
            </div>
            <div style={{ position: "fixed", bottom: 0 }}>
                <Footer />
            </div>
        </>
    );
};

export default AdminProfilePage;
