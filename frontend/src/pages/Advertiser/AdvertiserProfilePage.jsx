/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import bg from "../../assets/images/profilesBackground.png";
import ProfileButton from "../../components/ProfileButtons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { uploadFile } from "../../api/firebase.js";

import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
//import CheckIcon from "@mui/icons-material/Check";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton"; // Ensure this is imported for the close button
import CloseIcon from "@mui/icons-material/Close";
import Button from "../../components/Button";
import styled from "styled-components";

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    min-height: 100vh; /* Full viewport height */
    padding: 0;
    position: relative;
    width: 100vw; /* Full viewport width */
    top: 0;
    left: 0;
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 1vh; /* Adjusted to create space below the header */
    position: relative;
    margin-bottom: 1vh;
`;
const Button1 = styled.button`
    padding: 1vh 2vh;
    font-size: 1.5vh;
    font-weight: bold;
    border: none;
    border-radius: 0.5vh;
    cursor: pointer;

    &:hover {
        background-color: #f0f0f0; // Change to your preferred hover color
    }
`;

const ChangePassword = styled(Button1)`
    width: 15%;
    height: 5vh;
    background: white;
    border-radius: 20vh;
    border: 0.1vh solid #9c4f21;
    color: #9c4f21;

    &:hover {
        background-color: #9c4f21; // Change to your preferred hover color
        color: white; // Optional: Change text color on hover
    }
`;

const DeleteAccount = styled(Button1)`
    width: 15%;
    height: 5vh;
    background: white;
    border-radius: 20vh;
    border: 0.1vh solid red;
    color: red;

    &:hover {
        background-color: red; // Change to your preferred hover color
        color: white; // Optional: Change text color on hover
    }
`;

const MainContent = styled.div`
    margin-top: 5vh;
    display: flex;
    flex-direction: column;
    align-items: center; // Ensure child elements can stretch to fill the height
    width: 80%;
    margin-top: 10px;
`;

const ProfileDetailsBox = styled.div`
    display: flex; // Flex layout for horizontal arrangement
    flex-direction: row;
    flex: 1; // Allows it to grow or shrink proportionally
    background: white;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    padding: 20px;
    display: flex;
`;

const ProfileImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 30%; // Adjust width for the picture section
    margin-right: 5%; // Adjust margin for the picture section
`;

const ProfileDetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 70%; // Adjust width for the details section
`;

const InfoBoxesContainer = styled.div`
    display: flex;
    gap: 20px;
    align-items: stretch; // Ensures all child elements have the same height
    align-content: stretch; // Ensures all child elements have the same height
    width: 100%; // Set the desired width here
`;
const CustomAlert = ({ message, severity, open, onClose }) => {
    // Automatically close the alert after a specified duration (e.g., 3000ms)
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose(); // Close the alert after the duration
            }, 5000); // Duration in milliseconds

            return () => clearTimeout(timer); // Cleanup the timer when unmounting or when `open` changes
        }
    }, [open, onClose]);

    return (
        <>
            {open && ( // Render the alert only if it is open
                <div
                    style={{
                        position: "fixed", // Fixed position to keep it in view
                        bottom: "5vh", // Distance from the bottom of the page
                        right: "10vh", // Distance from the right of the page
                        zIndex: 1000, // Ensure it is on top of other elements
                    }}
                >
                    <Collapse in={open}>
                        <Alert
                            severity={severity || "info"}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={onClose}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{
                                mb: 2,
                                minHeight: "5vh", // Minimum height for better visibility
                                height: "auto", // Allow height to expand
                                width: "60vh", // Fixed width to prevent excessive stretching
                                fontSize: "1rem", // Adjust text size as needed
                                padding: "10px 15px", // Padding for content space
                            }}
                        >
                            {message}
                        </Alert>
                    </Collapse>
                </div>
            )}
        </>
    );
};
const AdvertiserProfilePage = () => {
    const [response, setResponse] = useState(null);
    const [userType, setUserType] = useState("Advertiser");
    const [isEditing, setIsEditing] = useState(false);
    const [isEditing1, setIsEditing1] = useState(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        companyProfile: "",
        website: "",
        hotline: "",
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");

    const showAlert = (message, severity = "info") => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };
    const handleCloseAlert = () => {
        setAlertOpen(false);
    };
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
    const handleEditProfileSubmit1 = () => {
        setIsEditing1(true);
    };

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleChange1 = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Save changes if there are any updates
    const handleSaveChanges = () => {
        // Check if any fields have changed
        const hasChanges =
            formData.name !== response.name ||
            formData.email !== response.email ||
            formData.website !== response.website ||
            formData.hotline !== response.hotline ||
            imageFile !== null; // Check if an image file exists

        if (hasChanges) {
            const formDataToUpdate = new FormData();

            // Append all form data fields
            for (const key in formData) {
                formDataToUpdate.append(key, formData[key]);
            }

            // Append the image file if it exists
            if (imageFile) {
                formDataToUpdate.append("picture", imageFile);
            }

            axiosInstance
                .put("/advertiser/updateAdvertiser", formDataToUpdate, {
                    withCredentials: true,
                })
                .then((response) => {
                    setResponse(response.data);
                    setIsEditing(false);
                    showAlert("Profile updated successfully", "success"); // Use showAlert instead of alert
                    setImage(response.data.picture || defaultImage); // Update image state if there's a new image
                    Cookies.set("profileImage", image);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                    showAlert("An error occurred while updating the profile.", "error"); // Use showAlert instead of alert
                });
        } else {
            setIsEditing(false);
            showAlert("No changes to save.", "info"); // Use showAlert instead of alert
        }
    };

    const handleSaveChanges1 = () => {
        if (formData.companyProfile !== response.companyProfile) {
            axiosInstance
                .put("/advertiser/updateAdvertiser", formData, {
                    withCredentials: true,
                })
                .then((response) => {
                    setResponse(response.data);
                    setIsEditing1(false);
                    showAlert("Profile updated successfully", "success"); // Use showAlert instead of alert
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                    showAlert("An error occurred while updating the profile.", "error"); // Use showAlert instead of alert
                });
        } else {
            setIsEditing1(false);
            showAlert("No changes to save.", "info"); // Use showAlert instead of alert
        }
    };

    const handleDeleteAccount = () => {
        setIsDeleteConfirmationOpen(true);
    };
    const handleDeleteAccountConfirm = () => {
        axiosInstance
            .delete("/advertiser/deleteAdvertiser", { withCredentials: true })
            .then(() => {
                showAlert("Advertiser account deleted successfully", "success"); // Use showAlert instead of alert
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
                showAlert(errorMessage, "error"); // Use showAlert instead of alert
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
            showAlert("New passwords do not match!", "warning"); // Use showAlert instead of alert
            return;
        }
        axiosInstance
            .put(
                "/advertiser/changeAdvertiserPassword",
                { oldPassword: currentPassword, newPassword },
                { withCredentials: true }
            )
            .then((response) => {
                showAlert("Password changed successfully", "success"); // Use showAlert instead of alert
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
                showAlert(errorMessage, "error"); // Use showAlert instead of alert
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
                    showAlert("Profile picture updated successfully!", "success"); // Use showAlert instead of alert
                    console.log("Updated Advertiser Picture:", response.data.picture);

                    // Ensure response.data contains the full URL of the picture
                    setResponse((prev) => ({
                        ...prev,
                        picture: response.data.picture, // This should be a string URL
                    }));

                    setImage(response.data.picture);
                    console.log("Updated Touguide Picture:", response.data.picture);
                    Cookies.set("profileImage", response.data.picture);
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000); // Alert will close after 5 seconds
                })
                .catch((error) => {
                    console.error("Error uploading picture:", error);
                    showAlert("An error occurred while uploading the picture.", "error"); // Use showAlert instead of alert
                });
        }
    };

    return (
        <PageWrapper>
            <div
                style={{
                    bottom: "20px",
                    width: "100vw",
                    height: "40vh",
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    top: "20vh", // Correcting to lowercase 'top' from 'Top'
                    marginBottom: "20px", // Add the desired margin bottom here
                }}
            ></div>

            <Navbar />
            <CustomAlert
                message={alertMessage}
                severity={alertSeverity}
                open={alertOpen}
                onClose={handleCloseAlert}
            />
            <MainContent>
                <InfoBoxesContainer>
                    <ProfileDetailsBox>
                        {/* Profile Image Section */}
                        <ProfileImageContainer>
                            <div
                                onClick={isEditing ? handleImageClick : undefined} // Clickable only when isEditing is true
                                style={{
                                    width: "10vw",
                                    height: "10vw",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: "4px solid white",
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    cursor: isEditing ? "pointer" : "default", // Add cursor pointer to indicate clickability
                                }}
                            ></div>

                            {/* Hidden File Input for Profile Image Upload */}
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />

                            <strong>
                                <p> {response?.name || "name not provided"}</p>
                            </strong>
                            <p> @{response?.username || "username not provided"}</p>
                        </ProfileImageContainer>

                        {/* Profile Details Section */}
                        <ProfileDetailsContainer>
                            <h2>Profile Details</h2>
                            {isEditing ? (
                                <div>
                                    <p style={{ marginBottom: "16px" }}>
                                        <strong>Name:</strong>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            name="name"
                                            label="Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={{ marginTop: "8px" }}
                                        />
                                    </p>
                                    <p style={{ marginBottom: "16px" }}>
                                        <strong>Email:</strong>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            name="email"
                                            label="Email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={{ marginTop: "8px" }}
                                        />
                                    </p>
                                    <p style={{ marginBottom: "16px" }}>
                                        <strong>Company Website:</strong>
                                        <TextField
                                            id="outlined"
                                            placeholder="Placeholder"
                                            multiline
                                            fullWidth
                                            size="small"
                                            name="website"
                                            label="Company Website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            style={{
                                                marginTop: "8px",
                                                height: "fit-content",
                                            }}
                                        />
                                    </p>
                                    <p style={{ marginBottom: "16px" }}>
                                        <strong>Hotline:</strong>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            name="hotline"
                                            label="Hotline"
                                            value={formData.hotline}
                                            onChange={handleChange}
                                            style={{ marginTop: "8px" }}
                                        />
                                    </p>
                                    <p style={{ marginBottom: "16px" }}>
                                        <button
                                            style={{
                                                width: "45%",
                                                height: "5vh",
                                                background: "white",
                                                borderRadius: "20vh",
                                                border: "0.1vh solid #9c4f21",
                                                color: "#9c4f21",
                                                marginRight: "10px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => setIsEditing(false)} // Function to handle cancel action
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            style={{
                                                padding: "10px 20px",
                                                backgroundColor: "#9c4f21",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "20vh",
                                                width: "45%",
                                                height: "5vh",
                                                cursor: "pointer",
                                                marginTop: "10px",
                                            }}
                                            onClick={handleSaveChanges}
                                        >
                                            Save Changes
                                        </button>
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <p>
                                        <strong>Name:</strong>{" "}
                                        {formData?.name || "Not Provided"}
                                    </p>
                                    <p>
                                        <strong>Email:</strong>{" "}
                                        {formData?.email || "Not Provided"}
                                    </p>
                                    <p>
                                        <strong>Company Website:</strong>{" "}
                                        {formData?.website || "Not Provided"}
                                    </p>
                                    <p>
                                        <strong>Hotline:</strong>{" "}
                                        {formData?.hotline || "Not Provided"}
                                    </p>
                                </>
                            )}
                        </ProfileDetailsContainer>
                        {!isEditing && ( // Render EditIcon only when not in editing mode
                            <EditIcon
                                onClick={handleEditProfileSubmit} // Add the click functionality
                                style={{
                                    cursor: "pointer", // Make it look clickable
                                    fontSize: "24px", // Adjust the size as needed
                                    color: "#000", // Optional: Customize the color
                                    margin: "10px", // Optional: Add spacing
                                }}
                                titleAccess="Edit Profile" // Optional: Add tooltip for accessibility
                            />
                        )}
                    </ProfileDetailsBox>
                    <ProfileDetailsBox>
                        <ProfileDetailsContainer
                            style={{
                                marginBottom: "100px",
                                marginLeft: "30px",
                            }}
                        >
                            <h2 style={{ marginBottom: "10px" }}>About The Company</h2>
                            {isEditing1 ? (
                                <div>
                                    <p style={{ marginBottom: "16px" }}>
                                        <Box
                                            component="form"
                                            sx={{
                                                "& .MuiTextField-root": {
                                                    m: 1,
                                                    // width: "25ch", // Remove this line
                                                },
                                            }}
                                            noValidate
                                            autoComplete="off"
                                        >
                                            <TextField
                                                variant="outlined" // Use "outlined" for the outlined variant
                                                size="small"
                                                multiline // Add this prop if you want a textarea
                                                rows={4} // Specify the number of rows for the textarea
                                                name="companyProfile"
                                                label="Company Profile"
                                                value={formData.companyProfile}
                                                onChange={handleChange1}
                                                fullWidth // Keep this if you want the TextField to be full width
                                            />
                                        </Box>
                                    </p>
                                    <p style={{ marginBottom: "16px" }}>
                                        <button
                                            style={{
                                                width: "45%",
                                                height: "5vh",
                                                background: "white",
                                                borderRadius: "20vh",
                                                cursor: "pointer",
                                                border: "0.1vh solid #9c4f21",
                                                color: "#9c4f21",
                                                marginRight: "10px",
                                            }}
                                            onClick={() => setIsEditing1(false)} // Function to handle cancel action
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            style={{
                                                padding: "10px 20px",
                                                backgroundColor: "#9c4f21",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "20vh",
                                                width: "45%",
                                                height: "5vh",
                                                cursor: "pointer",
                                                marginTop: "10px",
                                            }}
                                            onClick={handleSaveChanges1}
                                        >
                                            Save Changes
                                        </button>
                                    </p>
                                </div>
                            ) : (
                                <p>
                                    {response?.companyProfile ||
                                        "No company profile provided"}
                                </p>
                            )}
                        </ProfileDetailsContainer>

                        {!isEditing1 && ( // Render EditIcon only when not in editing mode
                            <EditIcon
                                onClick={handleEditProfileSubmit1} // Add the click functionality
                                style={{
                                    cursor: "pointer", // Make it look clickable
                                    fontSize: "24px", // Adjust the size as needed
                                    color: "#000", // Optional: Customize the color
                                    marginLeft: "8vw", // Optional: Add spacing
                                    marginTop: "1vh", // Optional: Add spacing
                                }}
                                titleAccess="Edit Profile" // Optional: Add tooltip for accessibility
                            />
                        )}
                    </ProfileDetailsBox>
                </InfoBoxesContainer>
                <hr
                    style={{
                        width: "90%",
                        borderTop: "2px solid #ccc",
                        marginTop: "3vh",
                        marginBottom: "3vh",
                    }}
                />
                <ButtonContainer>
                    <DeleteAccount onClick={handleDeleteAccount}>
                        Delete Account
                    </DeleteAccount>
                    <PopUp
                        isOpen={isDeleteConfirmationOpen}
                        setIsOpen={setIsDeleteConfirmationOpen}
                        headerText={"Are you sure you want to delete your account?"}
                        actionText={"Confirm"}
                        handleSubmit={handleDeleteAccountConfirm}
                    ></PopUp>
                    <ChangePassword onClick={handleChangePassword}>
                        Change Password
                    </ChangePassword>
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
                </ButtonContainer>
            </MainContent>
            <Footer />
        </PageWrapper>
    );
};

export default AdvertiserProfilePage;
