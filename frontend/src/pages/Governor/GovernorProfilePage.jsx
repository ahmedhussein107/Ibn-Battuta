/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import Footer from "../../components/Footer";
import profileBackground from "../../assets/backgrounds/profile_bg.jpeg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import { uploadFile } from "../../api/firebase.js";
import Button from "../../components/Button";
import Alert from "@mui/material/Alert";

const GovernorProfilePage = () => {
    const [response, setResponse] = useState(null);
    const [userType, setUserType] = useState("Governor");
    const [isEditing, setIsEditing] = useState(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", username: "", email: "" });
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
            .get("/governor/getGovernor", { withCredentials: true })
            .then((response) => {
                setResponse(response.data);
                console.log("Governor Profile:", response.data);
                // Set formData only after successfully fetching response
                setFormData({
                    name: response.data.name || "",
                    username: response.data.username || "",
                    email: response.data.email || "",
                });
                setImage(response.data.picture || defaultImage);
            })
            .catch((error) => {
                console.error("Error fetching Governor:", error);
                showAlert("error", "An error occurred while fetching the profile.");
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
                .put("/governor/updateGovernor", formData, { withCredentials: true })
                .then((res) => {
                    setResponse(res.data);
                    setIsEditing(false);
                    showAlert("success", "Profile updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                    showAlert("error", "An error occurred while updating the profile.");
                });
        } else {
            // No changes made; close edit mode without saving
            setIsEditing(false);
            console.log("No changes to save");
        }
    };
    const handleDeleteAccount = () => {
        setIsDeleteConfirmationOpen(true);
    };

    const handleDeleteAccountConfirm = () => {
        axiosInstance
            .delete("/governor/deleteGovernor", { withCredentials: true })
            .then(() => {
                showAlert("Governor account deleted successfully");
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

                console.error("Error deleting Tourguide account:", error);
                showAlert("error", errorMessage); // Display the error message in an alert
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
                "/governor/changeGovernorPassword",
                { oldPassword: currentPassword, newPassword },
                { withCredentials: true }
            )
            .then((response) => {
                showPopUpAlert("success", "Password changed successfully");
                setTimeout(() => {
                    setIsPopUpOpen(false); // Close the popup after a delay
                }, 500);

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

    // Function to handle file input change
    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            const image = await uploadFile(file, "governor-profile-pictures");
            formData.append("picture", image);

            axiosInstance
                .put("/governor/updateGovernor", formData, {
                    withCredentials: true,
                })
                .then((response) => {
                    showAlert("success", "Profile picture updated successfully!");
                    console.log("Updated Governor Picture:", response.data.picture);

                    // Ensure response.data contains the full URL of the picture
                    setResponse((prev) => ({
                        ...prev,
                        picture: response.data.picture, // This should be a string URL
                    }));

                    console.log("Updated Governor Picture:", response.data.picture);
                    Cookies.set("profileImage", image);
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
        }, 500); // Alert will close after 5 seconds
    };

    const showPopUpAlert = (severity, message) => {
        setPopupAlert({ open: true, severity, message });
        setTimeout(() => {
            setPopupAlert({ open: false, severity: "", message: "" }); // Close the alert after some time
        }, 500); // Alert will close after 5 seconds
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
                    justifyContent: "space-between", // Align items to the left
                    height: "50vh",
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
                            width: "50%",
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
                            width: "100%",
                            fontSize: "1.2rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2vh",
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "3vh" }}>
                        <div>
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
                        </div>
                        <div>
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
                        </div>
                        <div>
                            <label style={{ marginLeft: "2vw" }}>
                                Confirm New Password:
                            </label>
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
                        </div>
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
                    </div>
                </PopUp>
            </div>
            <div>
                {alert.open && (
                    <div
                        style={{
                            position: "fixed",
                            top: "50%", // Center vertically
                            right: "20px", // You can adjust this value to move it left/right
                            transform: "translateY(-50%)", // Center the alert vertically
                            zIndex: 1000, // Ensure it's above other content
                            width: "30vw", // Set a suitable width
                            fontSize: "30px",
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

export default GovernorProfilePage;

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
