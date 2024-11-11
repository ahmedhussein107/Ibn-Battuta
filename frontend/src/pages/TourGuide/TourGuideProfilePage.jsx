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
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { uploadFile } from "../../api/firebase.js";

const TourguideProfilePage = () => {
    const [response, setResponse] = useState(null);
    const [userType, setUserType] = useState("TourGuide");
    const [isEditing, setIsEditing] = useState(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const defaultImage =
        "https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg";
    const [image, setImage] = useState(defaultImage);
    const [imageFile, setImageFile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [value, setValue] = React.useState(null);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        mobile: "",
        yearsOfExperience: "",
        previousWork: [],
    });
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        axiosInstance
            .get("/tourguide/tourGuide", { withCredentials: true })
            .then((response) => {
                setResponse(response.data);
                setFormData({
                    name: response.data.name,
                    username: response.data.username,
                    email: response.data.email,
                    mobile: response.data.mobile,
                    yearsOfExperience: response.data.yearsOfExperience,
                    previousWork: response.data.previousWork || [],
                });
                const ratings = response.data.ratings || [];
                const sumOfRatings = response.data.sumOfRatings;
                console.log(response.data);
                console.log(response.data.ratings, "  ", response.data.sumOfRatings);
                const averageRating =
                    ratings.length > 0 ? sumOfRatings / ratings.length : 0;
                setValue(averageRating);
                setImage(response.data.picture || defaultImage);
            })
            .catch((error) => {
                console.error("Error fetching Tourguide:", error);
            });
    }, []);

    const handleEditProfileSubmit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePreviousWorkChange = (index, field, value) => {
        const updatedPreviousWork = formData.previousWork.map((work, i) =>
            i === index ? { ...work, [field]: value } : work
        );
        setFormData((prev) => ({ ...prev, previousWork: updatedPreviousWork }));
    };

    const handleSaveChanges = () => {
        // Check if any field in formData has been changed compared to the original response
        const hasChanges =
            formData.name !== response.name ||
            formData.email !== response.email ||
            formData.mobile !== response.mobile ||
            formData.yearsOfExperience !== response.yearsOfExperience ||
            JSON.stringify(formData.previousWork) !==
                JSON.stringify(response.previousWork);

        if (hasChanges) {
            axiosInstance
                .put("/tourguide/updateTourGuide", formData, {
                    withCredentials: true,
                })
                .then((response) => {
                    setResponse(response.data);
                    setIsEditing(false);
                    alert("Profile updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                });
        } else {
            // No changes made
            setIsEditing(false);
            console.log("No changes to save");
        }
    };

    const handleDeleteAccount = () => {
        setIsDeleteConfirmationOpen(true);
    };

    const handleDeleteAccountConfirm = () => {
        axiosInstance
            .delete("/tourguide/deleteTourguide", { withCredentials: true })
            .then(() => {
                alert("Tourguide account deleted successfully");
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
                alert(errorMessage); // Display the error message in an alert
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
        console.log(currentPassword, newPassword, confirmNewPassword);
        axiosInstance
            .put(
                "/tourguide/changeTourguidePassword",
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

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            const image = await uploadFile(file, "tourguide-profile-pictures");
            formData.append("picture", image);

            axiosInstance
                .put("/tourguide/updateTourGuide", formData, {
                    withCredentials: true,
                })
                .then((response) => {
                    alert("Profile picture updated successfully!");
                    console.log("Updated Tourguide Picture:", response.data.picture);

                    // Ensure response.data contains the full URL of the picture
                    setResponse((prev) => ({
                        ...prev,
                        picture: response.data.picture, // This should be a string URL
                    }));

                    console.log("Updated Touguide Picture:", response.data.picture);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error uploading picture:", error);
                    alert("An error occurred while uploading the picture.");
                });
        }
    };

    const handleAddNewExperience = () => {
        setFormData((prev) => ({
            ...prev,
            previousWork: [
                ...prev.previousWork,
                { title: "", duration: "", description: "" }, // Empty values for the new experience
            ],
        }));
    };

    const handleDeleteExperience = (index) => {
        const updatedPreviousWork = formData.previousWork.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, previousWork: updatedPreviousWork }));
    };

    return (
        <>
            <div
                style={{
                    width: "100vw",
                    position: "absolute",
                    top: "0",
                    left: "0",
                }}
            >
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
                <div style={{ marginTop: "-8vh", marginLeft: "5vw" }}>
                    <Typography component="legend"></Typography>
                    <Rating name="read-only" value={value} readOnly />
                    <p>{value === null ? "No ratings yet" : value.toFixed(1) + "/5"}</p>
                </div>
                <div>
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
                        <p>
                            <strong>Mobile Number:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
                            ) : (
                                response?.mobile || "No mobile number provided"
                            )}
                        </p>
                        <p>
                            <strong>Years Of Experience:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="yearsOfExperience"
                                    value={formData.yearsOfExperience}
                                    onChange={handleChange}
                                />
                            ) : (
                                response?.yearsOfExperience ||
                                "No experience info provided"
                            )}
                        </p>
                        {/* Button to add new experience */}

                        {/* Updated Previous Work Section */}
                        <div style={{ marginBottom: "6vw" }}>
                            <h3>Previous Work</h3>

                            {formData.previousWork.length > 0
                                ? formData.previousWork.map((work, index) => (
                                      <div
                                          key={index}
                                          style={{
                                              border: "1px solid #ccc",
                                              padding: "1vw",
                                              marginBottom: "1vw",
                                              borderRadius: "8px",
                                              position: "relative", // For positioning the delete icon
                                          }}
                                      >
                                          <p>
                                              <strong>Title:</strong>{" "}
                                              {isEditing ? (
                                                  <input
                                                      type="text"
                                                      value={work.title}
                                                      onChange={(e) =>
                                                          handlePreviousWorkChange(
                                                              index,
                                                              "title",
                                                              e.target.value
                                                          )
                                                      }
                                                  />
                                              ) : (
                                                  work.title || "No title provided"
                                              )}
                                          </p>
                                          <p>
                                              <strong>Duration:</strong>{" "}
                                              {isEditing ? (
                                                  <input
                                                      type="number"
                                                      value={work.duration}
                                                      onChange={(e) =>
                                                          handlePreviousWorkChange(
                                                              index,
                                                              "duration",
                                                              e.target.value
                                                          )
                                                      }
                                                  />
                                              ) : (
                                                  `${work.duration || 0} months`
                                              )}
                                          </p>
                                          <p>
                                              <strong>Description:</strong>{" "}
                                              {isEditing ? (
                                                  <textarea
                                                      value={work.description}
                                                      onChange={(e) =>
                                                          handlePreviousWorkChange(
                                                              index,
                                                              "description",
                                                              e.target.value
                                                          )
                                                      }
                                                      rows={4}
                                                      style={{
                                                          width: "100%",
                                                          resize: "vertical",
                                                      }}
                                                  />
                                              ) : (
                                                  work.description ||
                                                  "No description provided"
                                              )}
                                          </p>

                                          {/* Delete icon */}
                                          {isEditing && (
                                              <button
                                                  onClick={() =>
                                                      handleDeleteExperience(index)
                                                  }
                                                  style={{
                                                      position: "absolute",
                                                      top: "10px",
                                                      right: "10px",
                                                      cursor: "pointer",
                                                      background: "transparent",
                                                      border: "none",
                                                      color: "red",
                                                      fontSize: "1.2em",
                                                  }}
                                              >
                                                  <DeleteIcon />
                                              </button>
                                          )}
                                      </div>
                                  ))
                                : // Only show this message if not editing and no experience
                                  !isEditing && <p>No previous work provided</p>}

                            {isEditing && (
                                <button
                                    onClick={handleAddNewExperience}
                                    style={{
                                        padding: "1vw 2vw",
                                        backgroundColor: "white",
                                        color: "black",
                                        border: "1px solid black",
                                        borderRadius: "40px",
                                        cursor: "pointer",
                                        marginBottom: "2vw",
                                        marginLeft: "auto",
                                    }}
                                >
                                    Add New Experience
                                </button>
                            )}
                        </div>
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
            <div style={{ position: "fixed", top: 0, left: "9%" }}>
                <Navbar />
            </div>
            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    width: "100vw",
                    left: 0,
                }}
            >
                <Footer />
            </div>
        </>
    );
};

export default TourguideProfilePage;
