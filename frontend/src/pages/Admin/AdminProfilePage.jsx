/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import profileBackground from "../../assets/backgrounds/profile_bg.jpeg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import Footer from "../../components/Footer";
import bg from "../../assets/images/bg.jpg";
import ProfileButton from "../../components/ProfileButtons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import { uploadFile } from "../../api/firebase.js";
import Button from "../../components/Button";
import Alert from "@mui/material/Alert";

import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import axios from "axios";

const AdminProfilePage = () => {
    const [response, setResponse] = useState(null);
    const [userType, setUserType] = useState("Admin");
    const [isEditing, setIsEditing] = useState(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", username: "", email: "" });
    const [promoCode, setPromoCode] = useState(null);
    const [isPromoCodeLoading, setIsPromoCodeLoading] = useState(false);
    const defaultImage =
        "https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg";
    const [image, setImage] = useState(defaultImage);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [alert, setAlert] = useState({ open: false, severity: "info", message: "" });
    const [popupAlert, setPopupAlert] = useState({
        open: false,
        severity: "info",
        message: "",
    });

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

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
                setImage(response.data.picture || defaultImage);
            })
            .catch((error) => {
                showAlert("error", error.message);
                console.error("Error fetching Admin:", error);
            });
    }, []);

    const handleEditProfileSubmit = () => {
        setIsEditing(true);
    };

    const handleApplyPromoCode = async () => {
        console.log("i am here at promocode");
        if (!promoCode || promoCode.trim() === "") {
            return;
        }
        setIsPromoCodeLoading(true);
        try {
            await axiosInstance.post(
                "/promoCode/createPromoCode",
                {
                    code: promoCode,
                },
                { withCredentials: true }
            );
            console.log("Promo code applied successfully");
            setPromoCode("");
        } catch (err) {
        } finally {
            setIsPromoCodeLoading(false);
        }
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
                    showAlert("success", "Profile updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                    showAlert("error", error.message);
                });
        } else {
            // No changes made; you could also log a message or do nothing
            setIsEditing(false);
            console.log("No changes to save");
        }
    };

    const handleDeleteAccount = () => {
        setIsDeleteConfirmationOpen(true);
    };

    const handleDeleteAccountConfirm = () => {
        axiosInstance
            .delete("/admin/deleteAdmin", { withCredentials: true })
            .then(() => {
                alert("Admin account deleted successfully");
                Cookies.remove("userType");
                setUserType("Guest");
                navigate("/");

                window.location.reload();
            })
            .catch((error) => {
                const errorMessage =
                    error.response && error.response.data && error.response.data.message
                        ? error.response.data.message
                        : "An error occurred while deleting the account. Please try again.";

                console.error("Error deleting Admin account:", error);
                showAlert(errorMessage); // Display the error message in an alert
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
            showPopUpAlert("error", "New passwords do not match!");
            return;
        }
        axiosInstance
            .put(
                "/admin/changeAdminPassword",
                { oldPassword: currentPassword, newPassword },
                { withCredentials: true }
            )
            .then((response) => {
                showPopUpAlert("success", "Password changed successfully");
                setTimeout(() => {
                    setIsPopUpOpen(false); // Close the popup after a delay
                }, 3000);
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
                showPopUpAlert("error", errorMessage);
            });
    };

    const handleImageClick = () => {
        fileInputRef.current.click(); // Triggers the file input click
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            const curImage = await uploadFile(file, "admin-profile-pictures");
            formData.append("picture", curImage);

            axiosInstance
                .put("/admin/updateAdmin", formData, {
                    withCredentials: true,
                })
                .then((response) => {
                    showAlert("success", "Profile picture updated successfully!");
                    console.log("Updated Admin Picture:", response.data.picture);

                    // Ensure response.data contains the full URL of the picture
                    setResponse((prev) => ({
                        ...prev,
                        picture: response.data.picture, // This should be a string URL
                    }));

                    setImage(response.data.picture);
                    console.log("Updated Admin Picture:", response.data.picture);
                    Cookies.set("profileImage", response.data.picture);
                    window.location.reload();
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000); // Alert will close after 5 seconds
                })
                .catch((error) => {
                    console.error("Error uploading picture:", error);
                    showAlert("error", "An error occurred while uploading the picture.");
                });
        }
    };

    const showAlert = (severity, message) => {
        setAlert({ open: true, severity, message });
        setTimeout(() => {
            setAlert({ open: false, severity: "", message: "" }); // Close the alert after some time
        }, 8000); // Alert will close after 5 seconds
    };

    const showPopUpAlert = (severity, message) => {
        setPopupAlert({ open: true, severity, message });
        setTimeout(() => {
            setPopupAlert({ open: false, severity: "", message: "" }); // Close the alert after some time
        }, 8000); // Alert will close after 5 seconds
    };

    const handleCancelChanges = () => {
        setIsEditing(false);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
                <div style={backgroundStyle}></div>
                {/* the first part of the page */}
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-start", // Align items to the left
                    height: "40vh",
                    flexDirection: "column",
                    width: "50vw",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.7)",
                    padding: "2vw",
                    borderRadius: "20px",
                    margin: "40vh auto 10vh", // shorthand for margin (top, auto for left/right, bottom)
                }}
            >
                <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                width: "10vw",
                                height: "10vw",
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "4px solid white",
                                backgroundImage: `url(${image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                marginTop: "5vh",
                                marginLeft: "3vh",
                                cursor: "pointer", // Indicate clickability
                            }}
                            onClick={isEditing ? handleImageClick : undefined}
                        />

                        {/* Hidden File Input for Profile Image Upload */}
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }} // Hides the file input
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                        <div>
                            <h2
                                style={{
                                    marginTop: "1vw", // Space above the text
                                    marginLeft: "1.5vw", // Space to the left of the text
                                }}
                            >
                                {response?.name || "Name not provided"}
                            </h2>
                            <p
                                style={{
                                    color: "gray",
                                    marginTop: "0.5vh", // Use positive margin to create space
                                    marginBottom: "1vh", // Optional: Adds margin below for spacing
                                    marginLeft: "3vw", // Space to the left of the text
                                }}
                            >
                                @{response?.username || "Username not provided"}
                            </p>
                        </div>
                    </div>
                    <div
                        style={{
                            width: "70vw",
                            marginTop: "7vh",
                            marginRight: "8vw",
                            fontSize: "25px",
                        }}
                    >
                        <h3>Profile Details</h3>
                        <p>
                            {isEditing && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <strong>Name:</strong>
                                    <Box
                                        component="form"
                                        sx={{
                                            "& > :not(style)": { m: 1, width: "25ch" },
                                        }}
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <TextField
                                            id="outlined-required"
                                            label="Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={{
                                                width: "25vw",
                                                height: "4vh",
                                                marginTop: "1vh",
                                                marginLeft: "0vw",
                                                marginBottom: "2vh",
                                            }}
                                        />
                                    </Box>
                                </div>
                            )}
                        </p>
                        <p>
                            <strong>Email:</strong>
                            {isEditing ? (
                                <Box
                                    component="form"
                                    sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        id="outlined-required"
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={{
                                            width: "25vw",
                                            height: "4vh",
                                            marginTop: "1vh",
                                            marginLeft: "0vw",
                                        }}
                                    />
                                </Box>
                            ) : (
                                response?.email || "No email provided"
                            )}
                        </p>
                    </div>
                    <EditIcon
                        style={{
                            top: "5vh",
                            right: "5vw",
                            fontSize: "2vw",
                            cursor: "pointer",
                        }}
                        onClick={handleEditProfileSubmit}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        direction: "row",
                        alignItems: "center",
                        marginLeft: "13vw",
                    }}
                >
                    {isEditing && (
                        <Button
                            stylingMode="always-light"
                            text="Cancel"
                            width="10vw"
                            customStyle={
                                {
                                    // marginLeft: "20vw",
                                }
                            }
                            handleClick={handleCancelChanges}
                        />
                    )}
                    {isEditing && (
                        <Button
                            stylingMode="always-dark"
                            text="Save Changes"
                            width="10vw"
                            customStyle={
                                {
                                    //marginLeft: "20vw",
                                }
                            }
                            handleClick={handleSaveChanges}
                        />
                    )}
                </div>
            </div>
            {/* <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <input
                    type="text"
                    placeholder="add a promo code..."
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{
                        height: "4vh",
                        border: "1px solid var(--accent-color)",
                        borderRadius: "50px",
                        padding: "5px",
                        paddingLeft: "20px",
                        marginRight: "10px",
                    }}
                />
                <Button
                    stylingMode="always-dark"
                    text="Apply"
                    width="10vw"
                    isLoading={isPromoCodeLoading}
                    customStyle={
                        {
                            //margin
                        }
                    }
                    handleClick={handleApplyPromoCode}
                />
            </div> */}
            <hr
                style={{
                    width: "90vw",
                    borderTop: "2px solid #ccc",
                    marginTop: "1vh",
                    marginLeft: "4.5vw",
                }}
            />
            <div
                style={{
                    display: "flex",
                    direction: "row",
                    justifyContent: "space-between",
                    gap: "3vw",
                    alignItems: "center",
                    // width: "100%",
                    marginTop: "2vw",
                    marginBottom: "2vw",
                }}
            >
                <button
                    style={{
                        // marginLeft: "-20vw",
                        height: "5vh",
                        width: "10vw",
                        background: "white",
                        borderRadius: "40px",
                        border: "1px #D00C09 solid",
                        color: "red",
                        marginLeft: "3vw",
                    }}
                    onClick={handleDeleteAccount}
                >
                    Delete Account
                </button>
                <PopUp
                    isOpen={isDeleteConfirmationOpen}
                    setIsOpen={setIsDeleteConfirmationOpen}
                    headerText={"Are you sure you want to delete your account?"}
                    actionText={"Confirm"}
                    handleSubmit={handleDeleteAccountConfirm}
                ></PopUp>

                <button
                    style={{
                        background: "white",
                        height: "5vh",
                        width: "10vw",
                        borderRadius: 100,
                        border: "1px black solid",
                        color: "black",
                        marginRight: "5vw",
                    }}
                    onClick={() => handleChangePassword()}
                >
                    Change Password
                </button>

                <PopUp
                    isOpen={isPopUpOpen}
                    setIsOpen={setIsPopUpOpen}
                    headerText={"Change Password"}
                    actionText={"Confirm"}
                    handleSubmit={PopUpAction}
                >
                    <label style={{ marginLeft: "2vw" }}>Current Password:</label>
                    <Box
                        component="form"
                        sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="outlined-password-input"
                            type="password"
                            label="Current Password"
                            name="Current Password"
                            value={currentPassword}
                            onChange={handleCurrentPasswordChange}
                            style={{
                                width: "25vw",
                                height: "4vh",
                                marginTop: "1vh",
                                marginLeft: "2vw",
                                marginBottom: "2vh",
                            }}
                        />
                    </Box>
                    <label style={{ marginLeft: "2vw" }}>New Password:</label>
                    <Box
                        component="form"
                        sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="outlined-password-input"
                            label="New Password"
                            type="password"
                            name="New Password"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            style={{
                                width: "25vw",
                                height: "4vh",
                                marginTop: "1vh",
                                marginLeft: "2vw",
                                marginBottom: "2vh",
                            }}
                        />
                    </Box>
                    <label style={{ marginLeft: "2vw" }}>Confirm New Password:</label>
                    <Box
                        component="form"
                        sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="outlined-password-input"
                            label="Confirm New Password"
                            type="password"
                            name="Confirm New Password"
                            onChange={handleConfirmNewPasswordChange}
                            value={confirmNewPassword}
                            style={{
                                width: "25vw",
                                height: "4vh",
                                marginTop: "1vh",
                                marginLeft: "2vw",
                                marginBottom: "2vh",
                            }}
                        />
                    </Box>

                    {popupAlert.open && (
                        <Alert
                            severity={popupAlert.severity}
                            onClose={() =>
                                setPopupAlert({
                                    ...popupAlert,
                                    open: false,
                                })
                            }
                            style={{
                                marginBottom: "1vh",
                                fontSize: "22px",
                                textAlign: "center",
                                marginTop: "2vh",
                            }}
                        >
                            {popupAlert.message}
                        </Alert>
                    )}
                </PopUp>
            </div>
            <div>
                {alert.open && (
                    <div
                        style={{
                            position: "fixed",
                            right: "1%",
                            bottom: "2%",
                            width: "25%",
                            justifyContent: "center",
                            zIndex: 1000,
                        }}
                    >
                        <Alert
                            severity={alert.severity}
                            onClose={() => setAlert({ ...alert, open: false })}
                        >
                            {alert.message}
                        </Alert>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default AdminProfilePage;

const backgroundStyle = {
    width: "100vw",
    height: "30vh",
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${profileBackground})`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    shadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const headerStyle = {
    position: "relative",
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "5%",
    color: "White",
};
