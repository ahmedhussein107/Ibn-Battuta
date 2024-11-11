/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import bg from "../../assets/images/bg.jpg";
import ProfileButton from "../../components/ProfileButtons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { uploadFile } from "../../api/firebase.js";
import axios from "axios";

const AdvertiserProfilePage = () => {
    const [response, setResponse] = useState(null);
    const [userType, setUserType] = useState("Advertiser");
    const [isEditing, setIsEditing] = useState(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        companyProfile: "",
        website: "",
        hotline: "",
    });
    const defaultImage =
        "https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg";
    const [image, setImage] = useState(defaultImage);
    const [imageFile, setImageFile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Fetch the advertiser data when the component mounts
    useEffect(() => {
        axiosInstance
            .get("/advertiser/advertiser", { withCredentials: true })
            .then((response) => {
                setResponse(response.data);
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                    companyProfile: response.data.companyProfile,
                    website: response.data.website,
                    hotline: response.data.hotline,
                });
                console.log("Advertiser:", response.data);
                setImage(response.data.picture || defaultImage);
            })
            .catch((error) => {
                console.error("Error fetching Advertiser:", error);
            });
    }, []);

    // Handle profile edit submission
    const handleEditProfileSubmit = () => {
        setIsEditing(true);
    };

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Save changes if there are any updates
    const handleSaveChanges = () => {
        if (
            formData.name !== response.name ||
            formData.email !== response.email ||
            formData.companyProfile !== response.companyProfile ||
            formData.website !== response.website ||
            formData.hotline !== response.hotline
        ) {
            axiosInstance
                .put("/advertiser/updateAdvertiser", formData, { withCredentials: true })
                .then((response) => {
                    setResponse(response.data);
                    setIsEditing(false);
                    alert("Profile updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                });
        } else {
            setIsEditing(false);
            console.log("No changes to save");
        }
    };

    const handleDeleteAccount = () => {
        setIsDeleteConfirmationOpen(true);
    };

    const handleDeleteAccountConfirm = () => {
        axiosInstance
            .delete("/advertiser/deleteAdvertiser", { withCredentials: true })
            .then(() => {
                alert("Advertiser account deleted successfully");
                Cookies.remove("userType");
                setUserType("Guest");
                navigate("/");
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error deleting Advertiser account:", error);
            });
    };
    const handleChangePassword = () => {
        setIsPopUpOpen(true);
    };

    const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
    const handleConfirmNewPasswordChange = (e) => setConfirmNewPassword(e.target.value);

    const PopUpAction = () => {
        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match!");
            return;
        }
        axiosInstance
            .put(
                "/advertiser/changeAdvertiserPassword",
                { oldPassword: currentPassword, newPassword },
                { withCredentials: true }
            )
            .then((response) => {
                alert("Password changed successfully");
                setIsPopUpOpen(false);
                // Clear input fields after submission
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            })
            .catch((error) => {
                const errorMessage =
                    error.response && error.response.data && error.response.data.message
                        ? error.response.data.message
                        : "An error occurred. Please try again.";
                console.error("Error changing password:", error);
                alert(errorMessage);
            });
    };

    const handleImageClick = () => {
        fileInputRef.current.click(); // Triggers the file input click
    };

    // Function to handle file input change
    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            const image = await uploadFile(file, "advertiser-profile-pictures");
            formData.append("picture", image);

            axiosInstance
                .put("/advertiser/updateAdvertiser", formData, {
                    withCredentials: true,
                })
                .then((response) => {
                    alert("Profile picture updated successfully!");
                    console.log("Updated Advertiser Picture:", response.data.picture);

                    // Ensure response.data contains the full URL of the picture
                    setResponse((prev) => ({
                        ...prev,
                        picture: response.data.picture, // This should be a string URL
                    }));

                    console.log("Updated Advertiser Picture:", response.data.picture);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error uploading picture:", error);
                    alert("An error occurred while uploading the picture.");
                });
        }
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
                <div>
                    <div
                        style={{
                            width: "10vw",
                            height: "10vw",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "4px solid white",
                            marginTop: "-10vh",
                            marginLeft: "45%",
                            backgroundImage: `url(${image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            cursor: "pointer", // Add cursor pointer to indicate clickability
                        }}
                        onClick={handleImageClick} // Add onClick to trigger file input
                    ></div>

                    {/* Hidden File Input for Profile Image Upload */}
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                </div>
                <div>
                    {/* Name and Username */}
                    {isEditing ? (
                        <h2
                            style={{
                                marginTop: "-1vw",
                                padding: "1vw",
                                textAlign: "center",
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
                                padding: "1vw",
                                textAlign: "center",
                            }}
                        >
                            {response?.name || "name not provided"}
                        </h2>
                    )}
                    <p
                        style={{
                            color: "gray",
                            marginTop: "-2.5vh",
                            textAlign: "center",
                        }}
                    >
                        @{response?.username || "username not provided"}
                    </p>
                    <hr
                        style={{
                            width: "90%",
                            borderTop: "2px solid #ccc",
                            marginTop: "2vh",
                            marginLeft: "5vw",
                        }}
                    />
                    <div
                        style={{
                            width: "60%",
                            textAlign: "left",
                            marginTop: "-2vw",
                            padding: "3vw",
                            marginBottom: "5vw",
                        }}
                    >
                        <h3>About The Company</h3>
                        {isEditing ? (
                            <textarea
                                name="companyProfile"
                                value={formData.companyProfile}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    height: "150px",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    fontSize: "16px",
                                    resize: "vertical",
                                }}
                            />
                        ) : (
                            <p>
                                {response?.companyProfile ||
                                    "No company profile provided"}
                            </p>
                        )}

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
                        <p>
                            <strong>Company Website:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            ) : (
                                response?.website || "No company website provided"
                            )}
                        </p>
                        <p>
                            <strong>Hotline:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="hotline"
                                    value={formData.hotline}
                                    onChange={handleChange}
                                />
                            ) : (
                                response?.hotline || "No hotline provided"
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
                            onChange={handleCurrentPasswordChange}
                            value={currentPassword}
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
                            onChange={handleNewPasswordChange}
                            value={newPassword}
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
                            onChange={handleConfirmNewPasswordChange}
                            value={confirmNewPassword}
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
                        onClick={handleDeleteAccount}
                    />
                    <PopUp
                        isOpen={isDeleteConfirmationOpen}
                        setIsOpen={setIsDeleteConfirmationOpen}
                        headerText={"Are you sure you want to delete your account?"}
                        actionText={"Confirm"}
                        handleSubmit={handleDeleteAccountConfirm}
                    ></PopUp>
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
            <div style={{ position: "fixed", top: 0, left: "9vw" }}>
                <Navbar />
            </div>
            <div style={{ position: "fixed", bottom: 0, width: "100vw", left: 0 }}>
                <Footer />
            </div>
        </>
    );
};

export default AdvertiserProfilePage;
