/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import Footer from "../../components/Footer";
import ProfileButton from "../../components/ProfileButtons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { uploadFile } from "../../api/firebase.js";
import Button from "../../components/Button";
import Alert from "@mui/material/Alert";
import profileBackground from "../../assets/backgrounds/profile_bg.jpeg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import ReviewsSection from "../../pages/Itinerary/ReviewsSection.jsx";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

const TourguideProfilePage = () => {
    const [response, setResponse] = useState(null);
    const [userType, setUserType] = useState("TourGuide");
    const [isEditing, setIsEditing] = useState(false);
    const [isPrevEditing, setIsPrevEditing] = useState(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const defaultImage =
        "https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg";
    const [image, setImage] = useState(defaultImage);
    const [imageFile, setImageFile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [ratings, setRatings] = useState([]);
    const [value, setValue] = React.useState(null);
    const [alert, setAlert] = useState({ open: false, severity: "info", message: "" });
    const [popupAlert, setPopupAlert] = useState({
        open: false,
        severity: "info",
        message: "",
    });
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
                setRatings(response.data.ratings || []);
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
                showAlert("error", "Error fetching your profile");
            });
    }, []);

    const handleEditProfileSubmit = () => {
        setIsEditing(true);
    };

    const handlePrevEditProfileSubmit = () => {
        setIsPrevEditing(true);
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
                    setIsPrevEditing(false);
                    showAlert("success", "Profile updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                    showAlert("error", "Error updating your profile");
                });
        } else {
            // No changes made
            setIsEditing(false);
            setIsPrevEditing(false);
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
                showAlert("success", "Tourguide account deleted successfully");
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
        console.log(currentPassword, newPassword, confirmNewPassword);
        axiosInstance
            .put(
                "/tourguide/changeTourguidePassword",
                { oldPassword: currentPassword, newPassword },
                { withCredentials: true }
            )
            .then((response) => {
                showPopUpAlert("success", "Password changed successfully");
                setTimeout(() => {
                    setIsPopUpOpen(false);
                }, 5000); // Alert will close after 5 seconds

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
            setIsLoading(true);
            const image = await uploadFile(file, "tourguide-profile-pictures");
            setIsLoading(false);
            formData.append("picture", image);

            axiosInstance
                .put("/tourguide/updateTourGuide", formData, {
                    withCredentials: true,
                })
                .then((response) => {
                    showAlert("success", "Profile picture updated successfully!");
                    console.log("Updated Tourguide Picture:", response.data.picture);
                    Cookies.set("picture", response.data.picture);

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
                    showAlert("error", "An error occurred while uploading the picture.");
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
    const handleCancelPrevChanges = () => {
        setIsPrevEditing(false);
    };

    return (
        // /*this is the main big component */
        <div>
            <div style={{ display: "flex", displayDirection: "column" }}>
                <div
                    style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}
                >
                    <div style={backgroundStyle}></div>
                </div>
                {/* end of the first part in the page header */}
                {/* {this will be having 4 components in columns} */}
                <div
                    style={{
                        display: "flex",
                        displayDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    {/* this will have two components beside each other in a row(profile details and rating*/}
                    <div
                        style={{
                            display: "flex",
                            displayDirection: "row",
                            justifyContent: "space-between",
                            //width: "100%",
                            gap: "3.5vw",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-start", // Align items to the left
                                height: "80vh",
                                flexDirection: "column",
                                width: "45vw",
                                backgroundColor: "#FFFFFF",
                                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.7)",
                                padding: "2vw",
                                borderRadius: "20px",
                                marginTop: "40vh",
                                marginBottom: "10vh",
                                marginLeft: "5vw",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "100%",
                                }}
                            >
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
                                            marginTop: "2vh",
                                            marginLeft: "1vh",
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
                                                marginTop: "0.5vw", // Space above the text
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
                                            @
                                            {response?.username ||
                                                "Username not provided"}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        width: "70vw",
                                        marginTop: "-2vh",
                                        marginRight: "5vw",
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
                                                        "& > :not(style)": {
                                                            m: 1,
                                                            width: "25ch",
                                                        },
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

                                                            marginBottom: "0.5vh",
                                                        }}
                                                    />
                                                </Box>
                                            </div>
                                        )}
                                    </p>
                                    <p style={{ marginTop: "2vh" }}>
                                        <strong>Email:</strong>
                                        {isEditing ? (
                                            <Box
                                                component="form"
                                                sx={{
                                                    "& > :not(style)": {
                                                        m: 1,
                                                        width: "25ch",
                                                    },
                                                }}
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
                                                        marginBottom: "1vh",
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            response?.email || "No email provided"
                                        )}
                                    </p>
                                    <p style={{ marginTop: "2vh" }}>
                                        <strong>Mobile Number:</strong>{" "}
                                        {isEditing ? (
                                            <Box
                                                component="form"
                                                sx={{
                                                    "& > :not(style)": {
                                                        m: 1,
                                                        width: "25ch",
                                                    },
                                                }}
                                                noValidate
                                                autoComplete="off"
                                                required
                                            >
                                                <TextField
                                                    id="outlined-basic"
                                                    label="Mobile Number"
                                                    name="mobile"
                                                    value={formData.mobile}
                                                    onChange={handleChange}
                                                    style={{
                                                        width: "25vw",
                                                        height: "4vh",
                                                        marginTop: "1vh",
                                                        marginBottom: "1vh",
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            //  <input
                                            //      type="text"
                                            //      name="mobile"
                                            //      value={formData.mobile}
                                            //      onChange={handleChange}
                                            //  />
                                            response?.mobile || "No number provided"
                                        )}
                                    </p>
                                    <p style={{ marginTop: "2vh" }}>
                                        <strong>Years Of Experience:</strong>{" "}
                                        {isEditing ? (
                                            <Box
                                                component="form"
                                                sx={{
                                                    "& > :not(style)": {
                                                        m: 1,
                                                        width: "25ch",
                                                    },
                                                }}
                                                noValidate
                                                autoComplete="off"
                                                required
                                            >
                                                <TextField
                                                    id="outlined-basic"
                                                    label="Years Of Experience"
                                                    name="yearsOfExperience"
                                                    type="number"
                                                    value={formData.yearsOfExperience}
                                                    onChange={handleChange}
                                                    style={{
                                                        width: "25vw",
                                                        height: "4vh",
                                                        marginTop: "1vh",
                                                        marginBottom: "1vh",
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            // <input
                                            //     type="number"
                                            //     name="yearsOfExperience"
                                            //     value={formData.yearsOfExperience}
                                            //     onChange={handleChange}
                                            // />
                                            response?.yearsOfExperience ||
                                            "No experience info provided"
                                        )}
                                    </p>
                                </div>
                                <EditIcon
                                    style={{
                                        marginTop: "-1vh",
                                        marginRight: "0vw",
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
                                    marginTop: "4vh",
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
                                        isLoading={isLoading}
                                    />
                                )}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-start", // Align items to the left
                                height: "3fit-content",
                                flexDirection: "column",
                                width: "35vw",
                                backgroundColor: "#FFFFFF",
                                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.7)",
                                padding: "2vw",
                                borderRadius: "20px",
                                marginTop: "40vh",
                                marginBottom: "10vh",
                                marginRight: "5vw",
                            }}
                        >
                            <ReviewsSection
                                ratingIds={ratings}
                                height={"100%"}
                                width={"100%"}
                                fontSize={"12px"}
                                reviewsPerPage={2}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    // justifyContent: "flex-start", // Align items to the left
                    height: "fit-content",
                    flexDirection: "column",
                    width: "86%",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.7)",
                    padding: "2vw",
                    borderRadius: "20px",
                    //marginTop: "40vh",
                    marginBottom: "10vh",
                    marginLeft: "5vw",
                }}
            >
                {/* Updated Previous Work Section */}
                <div>
                    <h3>Previous Work</h3>
                    {!isPrevEditing && (
                        <EditIcon
                            style={{
                                marginLeft: "85vw",
                                fontSize: "2vw",
                                cursor: "pointer",
                            }}
                            onClick={handlePrevEditProfileSubmit}
                        />
                    )}

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
                                      {isPrevEditing ? (
                                          <Box
                                              component="form"
                                              sx={{
                                                  "& > :not(style)": {
                                                      m: 1,
                                                      width: "25ch",
                                                  },
                                              }}
                                              noValidate
                                              autoComplete="off"
                                              required
                                          >
                                              <TextField
                                                  id="outlined-basic"
                                                  label="Title"
                                                  value={work.title}
                                                  onChange={(e) =>
                                                      handlePreviousWorkChange(
                                                          index,
                                                          "title",
                                                          e.target.value
                                                      )
                                                  }
                                                  style={{
                                                      width: "25vw",
                                                      height: "4vh",
                                                      marginTop: "1vh",
                                                      marginBottom: "1vh",
                                                  }}
                                              />
                                          </Box>
                                      ) : (
                                          work.title || "No title provided"
                                      )}
                                  </p>
                                  <p style={{ marginTop: "2vh" }}>
                                      <strong>Duration:</strong>{" "}
                                      {isPrevEditing ? (
                                          <Box
                                              component="form"
                                              sx={{
                                                  "& > :not(style)": {
                                                      m: 1,
                                                      width: "25ch",
                                                  },
                                              }}
                                              noValidate
                                              autoComplete="off"
                                              required
                                          >
                                              <TextField
                                                  id="outlined-basic"
                                                  label="Duration"
                                                  type="number"
                                                  value={work.duration}
                                                  onChange={(e) =>
                                                      handlePreviousWorkChange(
                                                          index,
                                                          "duration",
                                                          e.target.value
                                                      )
                                                  }
                                                  style={{
                                                      width: "25vw",
                                                      height: "4vh",
                                                      marginTop: "1vh",
                                                      marginBottom: "1vh",
                                                  }}
                                              />
                                          </Box>
                                      ) : (
                                          `${work.duration || 0} months`
                                      )}
                                  </p>
                                  <p style={{ marginTop: "2vh" }}>
                                      <strong>Description:</strong>{" "}
                                      {isPrevEditing ? (
                                          <Box
                                              component="form"
                                              sx={{
                                                  "& > :not(style)": {
                                                      m: 1,
                                                      width: "25ch",
                                                  },
                                              }}
                                              noValidate
                                              autoComplete="off"
                                              required
                                          >
                                              <TextField
                                                  id="outlined-basic"
                                                  label="Years Of Experience"
                                                  value={work.description}
                                                  onChange={(e) =>
                                                      handlePreviousWorkChange(
                                                          index,
                                                          "description",
                                                          e.target.value
                                                      )
                                                  }
                                                  style={{
                                                      width: "55vw",
                                                      height: "4vh",
                                                      marginTop: "1vh",
                                                      marginBottom: "1vh",
                                                  }}
                                              />
                                          </Box>
                                      ) : (
                                          //   <textarea
                                          //       value={work.description}
                                          //       onChange={(e) =>
                                          //           handlePreviousWorkChange(
                                          //               index,
                                          //               "description",
                                          //               e.target.value
                                          //           )
                                          //       }
                                          //       rows={4}
                                          //       style={{
                                          //           width: "100%",
                                          //           resize: "vertical",
                                          //       }}
                                          //   />
                                          work.description || "No description provided"
                                      )}
                                  </p>

                                  {/* Delete icon */}
                                  {isPrevEditing && (
                                      <button
                                          onClick={() => handleDeleteExperience(index)}
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
                          !isPrevEditing && (
                              <p
                                  style={{
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      fontSize: "20px",
                                      marginTop: "2vw",
                                  }}
                              >
                                  No previous work provided
                              </p>
                          )}

                    {isPrevEditing && (
                        <Box
                            sx={{ "& > :not(style)": { m: 1 } }}
                            style={{
                                textAlign: "center",
                                marginLeft: "-3vw",
                                marginTop: "4vh",
                                fontSize: "1.5em",
                            }}
                        >
                            <Fab
                                size="small"
                                sx={{
                                    backgroundColor: "#9c4f21",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#9c4f21",
                                        color: "white",
                                    },
                                }}
                                aria-label="add"
                                onClick={handleAddNewExperience}
                            >
                                <AddIcon />
                            </Fab>
                        </Box>
                    )}

                    <div
                        style={{
                            display: "flex",
                            direction: "row",
                            alignItems: "center",
                            marginLeft: "30vw",
                            marginTop: "4vh",
                        }}
                    >
                        {isPrevEditing && (
                            <Button
                                stylingMode="always-light"
                                text="Cancel"
                                width="10vw"
                                customStyle={
                                    {
                                        // marginLeft: "20vw",
                                    }
                                }
                                handleClick={handleCancelPrevChanges}
                            />
                        )}
                        {isPrevEditing && (
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
                        height: "5vh",
                        width: "10vw",
                        background: "white",
                        borderRadius: "40px",
                        border: "1px #D00C09 solid",
                        color: "red",
                        marginLeft: "4vw",
                        cursor: "pointer",
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
                        marginRight: "6vw",
                        cursor: "pointer",
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
                            bottom: "1%",
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

        //     <div
        //         style={{
        //             width: "100vw",
        //             position: "absolute",
        //             top: "0",
        //             left: "0",
        //         }}
        //     >
        //         <div
        //             style={{
        //                 width: "100vw",
        //                 height: "30vh",
        //                 backgroundImage: `url(${profileBackground})`,
        //                 backgroundSize: "100% 100%",
        //                 backgroundPosition: "center",
        //                 backgroundRepeat: "no-repeat",
        //             }}
        //         ></div>
        //         <div>
        //             <div
        //                 style={{
        //                     width: "10vw",
        //                     height: "10vw",
        //                     borderRadius: "50%",
        //                     overflow: "hidden",
        //                     border: "4px solid white",
        //                     marginTop: "-10vh",
        //                     marginLeft: "45%",
        //                     backgroundImage: `url(${image})`,
        //                     backgroundSize: "cover",
        //                     backgroundPosition: "center",
        //                     cursor: "pointer", // Add cursor pointer to indicate clickability
        //                 }}
        //                 onClick={handleImageClick} // Add onClick to trigger file input
        //             ></div>

        //             {/* Hidden File Input for Profile Image Upload */}
        //             <input
        //                 type="file"
        //                 accept="image/*"
        //                 style={{ display: "none" }}
        //                 ref={fileInputRef}
        //                 onChange={handleImageChange}
        //             />
        //         </div>
        //         <div style={{ marginTop: "-8vh", marginLeft: "5vw" }}>
        //             <Typography component="legend"></Typography>
        //             <Rating name="read-only" value={value} readOnly />
        //             <p>{value === null ? "No ratings yet" : value.toFixed(1) + "/5"}</p>
        //         </div>
        //         <div>
        //             {isEditing ? (
        //                 <h2
        //                     style={{
        //                         marginTop: "-1vw",
        //                         padding: "1vw",
        //                         textAlign: "center",
        //                     }}
        //                 >
        //                     <div>
        //                         <input
        //                             type="text"
        //                             id="name"
        //                             name="name"
        //                             value={formData.name}
        //                             onChange={handleChange}
        //                         />
        //                     </div>
        //                 </h2>
        //             ) : (
        //                 <h2
        //                     style={{
        //                         marginTop: "-1vw",
        //                         padding: "1vw",
        //                         textAlign: "center",
        //                     }}
        //                 >
        //                     {response?.name || "name not provided"}
        //                 </h2>
        //             )}
        //             <p
        //                 style={{
        //                     color: "gray",
        //                     marginTop: "-2.5vh",
        //                     textAlign: "center",
        //                 }}
        //             >
        //                 @{response?.username || "username not provided"}
        //             </p>
        //             <hr
        //                 style={{
        //                     width: "90%",
        //                     borderTop: "2px solid #ccc",
        //                     marginTop: "2vh",
        //                     marginLeft: "5vw",
        //                 }}
        //             />
        //             <div
        //                 style={{
        //                     width: "60%",
        //                     textAlign: "left",
        //                     marginTop: "-2vw",
        //                     padding: "3vw",
        //                 }}
        //             >
        //                 <h3>Profile Details</h3>
        //                 <p>
        //                     <strong>Email:</strong>{" "}
        //                     {isEditing ? (
        //                         <input
        //                             type="email"
        //                             name="email"
        //                             value={formData.email}
        //                             onChange={handleChange}
        //                         />
        //                     ) : (
        //                         response?.email || "No email provided"
        //                     )}
        //                 </p>
        //                 <p>
        //                     <strong>Mobile Number:</strong>{" "}
        //                     {isEditing ? (
        //                         <input
        //                             type="text"
        //                             name="mobile"
        //                             value={formData.mobile}
        //                             onChange={handleChange}
        //                         />
        //                     ) : (
        //                         response?.mobile || "No mobile number provided"
        //                     )}
        //                 </p>
        //                 <p>
        //                     <strong>Years Of Experience:</strong>{" "}
        //                     {isEditing ? (
        //                         <input
        //                             type="number"
        //                             name="yearsOfExperience"
        //                             value={formData.yearsOfExperience}
        //                             onChange={handleChange}
        //                         />
        //                     ) : (
        //                         response?.yearsOfExperience ||
        //                         "No experience info provided"
        //                     )}
        //                 </p>
        //                 {/* Button to add new experience */}

        //         {/* Updated Previous Work Section */}
        //         <div style={{ marginBottom: "6vw" }}>
        //             <h3>Previous Work</h3>

        //             {formData.previousWork.length > 0
        //                 ? formData.previousWork.map((work, index) => (
        //                       <div
        //                           key={index}
        //                           style={{
        //                               border: "1px solid #ccc",
        //                               padding: "1vw",
        //                               marginBottom: "1vw",
        //                               borderRadius: "8px",
        //                               position: "relative", // For positioning the delete icon
        //                           }}
        //                       >
        //                           <p>
        //                               <strong>Title:</strong>{" "}
        //                               {isEditing ? (
        //                                   <input
        //                                       type="text"
        //                                       value={work.title}
        //                                       onChange={(e) =>
        //                                           handlePreviousWorkChange(
        //                                               index,
        //                                               "title",
        //                                               e.target.value
        //                                           )
        //                                       }
        //                                   />
        //                               ) : (
        //                                   work.title || "No title provided"
        //                               )}
        //                           </p>
        //                           <p>
        //                               <strong>Duration:</strong>{" "}
        //                               {isEditing ? (
        //                                   <input
        //                                       type="number"
        //                                       value={work.duration}
        //                                       onChange={(e) =>
        //                                           handlePreviousWorkChange(
        //                                               index,
        //                                               "duration",
        //                                               e.target.value
        //                                           )
        //                                       }
        //                                   />
        //                               ) : (
        //                                   `${work.duration || 0} months`
        //                               )}
        //                           </p>
        //                           <p>
        //                               <strong>Description:</strong>{" "}
        //                               {isEditing ? (
        //                                   <textarea
        //                                       value={work.description}
        //                                       onChange={(e) =>
        //                                           handlePreviousWorkChange(
        //                                               index,
        //                                               "description",
        //                                               e.target.value
        //                                           )
        //                                       }
        //                                       rows={4}
        //                                       style={{
        //                                           width: "100%",
        //                                           resize: "vertical",
        //                                       }}
        //                                   />
        //                               ) : (
        //                                   work.description ||
        //                                   "No description provided"
        //                               )}
        //                           </p>

        //                           {/* Delete icon */}
        //                           {isEditing && (
        //                               <button
        //                                   onClick={() =>
        //                                       handleDeleteExperience(index)
        //                                   }
        //                                   style={{
        //                                       position: "absolute",
        //                                       top: "10px",
        //                                       right: "10px",
        //                                       cursor: "pointer",
        //                                       background: "transparent",
        //                                       border: "none",
        //                                       color: "red",
        //                                       fontSize: "1.2em",
        //                                   }}
        //                               >
        //                                   <DeleteIcon />
        //                               </button>
        //                           )}
        //                       </div>
        //                   ))
        //                 : // Only show this message if not editing and no experience
        //                   !isEditing && <p>No previous work provided</p>}

        //             {isEditing && (
        //                 <button
        //                     onClick={handleAddNewExperience}
        //                     style={{
        //                         padding: "1vw 2vw",
        //                         backgroundColor: "white",
        //                         color: "black",
        //                         border: "1px solid black",
        //                         borderRadius: "40px",
        //                         cursor: "pointer",
        //                         marginBottom: "2vw",
        //                         marginLeft: "auto",
        //                     }}
        //                 >
        //                     Add New Experience
        //                 </button>
        //             )}
        //         </div>
        //     </div>
        // </div>
        //         <div>
        //             <ProfileButton
        //                 buttonType="changePassword"
        //                 onClick={() => handleChangePassword()}
        //             />
        //             <PopUp
        //                 isOpen={isPopUpOpen}
        //                 setIsOpen={setIsPopUpOpen}
        //                 headerText={"Change Password"}
        //                 actionText={"Confirm"}
        //                 handleSubmit={PopUpAction}
        //             >
        //                 <label>Current Password:</label>
        //                 <input
        //                     type="password"
        //                     name="Current Password"
        //                     placeholder="Current Password"
        //                     onChange={handleCurrentPasswordChange}
        //                     value={currentPassword}
        //                     style={{
        //                         width: "80%", // Full width
        //                         padding: "1vw", // Padding for better spacing
        //                         marginBottom: "1vw", // Space between inputs
        //                         border: "1px solid #ccc", // Border style
        //                         borderRadius: "4px", // Rounded corners
        //                         alignItems: "center", // Align text to center
        //                     }}
        //                 />
        //                 <label>New Password:</label>
        //                 <input
        //                     type="password"
        //                     name="New Password"
        //                     placeholder="Current Password"
        //                     onChange={handleNewPasswordChange}
        //                     value={newPassword}
        //                     style={{
        //                         width: "80%", // Full width
        //                         padding: "1vw", // Padding for better spacing
        //                         marginBottom: "1vw", // Space between inputs
        //                         border: "1px solid #ccc", // Border style
        //                         borderRadius: "4px", // Rounded corners
        //                     }}
        //                 />
        //                 <label>Confirm New Password:</label>
        //                 <input
        //                     type="password"
        //                     name="Confirm New Password"
        //                     placeholder="Current Password"
        //                     onChange={handleConfirmNewPasswordChange}
        //                     value={confirmNewPassword}
        //                     style={{
        //                         width: "80%", // Full width
        //                         padding: "1vw", // Padding for better spacing
        //                         marginBottom: "1vw", // Space between inputs
        //                         border: "1px solid #ccc", // Border style
        //                         borderRadius: "4px", // Rounded corners
        //                     }}
        //                 />
        //             </PopUp>

        //             <ProfileButton
        //                 buttonType="deleteAccount"
        //                 onClick={handleDeleteAccount}
        //             />
        //             <PopUp
        //                 isOpen={isDeleteConfirmationOpen}
        //                 setIsOpen={setIsDeleteConfirmationOpen}
        //                 headerText={"Are you sure you want to delete your account?"}
        //                 actionText={"Confirm"}
        //                 handleSubmit={handleDeleteAccountConfirm}
        //             ></PopUp>
        //             {/* {isEditing ? (
        //                 <ProfileButton
        //                     buttonType="saveProfile"
        //                     onClick={handleSaveChanges}
        //                 />
        //             ) : (
        //                 <ProfileButton
        //                     buttonType="editProfile"
        //                     onClick={handleEditProfileSubmit}
        //                 />
        //             )} */}
        //         </div>
        //     </div>
        //     <div style={{ position: "fixed", top: 0, left: "9%" }}>
        //         <Navbar />
        //     </div>
        //     <div
        //         style={{
        //             position: "fixed",
        //             bottom: 0,
        //             width: "100vw",
        //             left: 0,
        //         }}
        //     >
        //         <Footer />
        //     </div>
        // </>
    );
};

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

export default TourguideProfilePage;
