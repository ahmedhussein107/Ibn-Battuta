import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";
import styled from "styled-components";
import { fetchAllTags } from "../../pages/Tag/fetchAllTags";
import Footer from "../../components/Footer";
import bg from "../../assets/images/bg.jpg";
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import { uploadFile } from "../../api/firebase";
import EditIcon from "@mui/icons-material/Edit";
//import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
//import CheckIcon from "@mui/icons-material/Check";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton"; // Ensure this is imported for the close button
import CloseIcon from "@mui/icons-material/Close";
import Button from "../../components/Button";
import { useCurrencyConverter } from "../../hooks/currencyHooks";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import CurrencyDropdown from "../../components/CurrencyDropdownList";
import LocationAdder from "../../components/LocationAdder";
import MapPopUp from "../../components/MapPopUp";

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

const WalletIcon = styled.img`
    width: 85%;
    height: 85%;
    margin-left: 5%;
`;
const LevelContainer = styled.div`
    font-size: 16px;
    color: black; /* Optional color change */
    flex-direction: column; /* Stack level text and progress bar vertically */
    margin-right: 5%;
`;

const levelImages = {
    1: "/level1.png", // Replace with actual path for Level 1
    2: "/level2.png", // Replace with actual path for Level 2
    3: "/level3.png", // Replace with actual path for Level 3
};

const PointsSection = styled.div`
    margin-top: 10px;
    font-size: 16px;
    flex-direction: row;
`;

const RedeemBox = styled.div`
    flex: 1; // Allow it to grow with the container
    background: white;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    padding: 20px;
    text-align: left;
    display: flex; // Use flex for consistent behavior
    flex-direction: row; // Change to column to stack contents vertically
    justify-content: flex-start; // Align contents to the start
    align-items: stretch; // Allow items to stretch to fit
    gap: 10px; // Add some space between items if needed
`;

const InputBox = styled.input`
    width: 100px;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;
    margin: 5px;
`;

const Arrow = styled.span`
    font-size: 24px;
    font-weight: bold;
    margin: 0 10px;
    font-size: 24px;
    font-weight: bold;
    margin: 0 10px;
`;

const PreferenceTagsBox = styled.div`
    flex: 1; // Matches height and width behavior of ProfileDetailsBox
    background: white;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    padding: 20px;
`;

const TagBubble = styled.span`
    display: inline-flex;
    align-items: center;
    background-color: #fae2b6;
    color: black;
    border-radius: 15px;
    padding: 5px 10px;
    margin: 5px;
    font-size: 14px;
`;

const CloseButton = styled.span`
    margin-left: 8px;
    cursor: pointer;
    color: black;
    font-weight: bold;
    margin-left: 8px;
    cursor: pointer;
    color: black;
    font-weight: bold;
`;
const Dropdown = styled.select`
    margin-top: 10px;
    padding: 5px;
    width: 60%; // Set the desired width here, e.g., 250px
    height: 40px;
`;
const CustomAlert = ({ message, severity, open, onClose }) => {
    // Automatically close the alert after a specified duration (e.g., 3000ms)
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose(); // Close the alert after the duration
            }, 3000); // Duration in milliseconds

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
                        zIndex: 2000, // Ensure it is on top of other elements
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

export default function TouristProfilePage() {
    const [tourist, setTourist] = useState(null);
    const [userType, setUserType] = useState("Tourist");
    const [tags, setTags] = useState([]);
    const defaultImage =
        "https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg";
    const [image, setImage] = useState(defaultImage);
    const [selectedTags, setSelectedTags] = useState([]);
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [redeemValue, setRedeemValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("info");
    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice } = useCurrencyConverter(currency);

    const [location, setLocation] = useState({
        longitude: 0,
        latitude: 0,
        location: "",
    });

    const [mapFunction, setMapFunction] = useState(null);
    const [isMapOpen, setIsMapOpen] = useState(false);

    useEffect(() => {
        if (mapFunction) {
            setIsMapOpen(true);
        }
    }, [mapFunction]);

    const showAlert = (message, severity = "info") => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };
    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        nationality: "",
        job: "",
        address: [],
        currency: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const message = localStorage.getItem("alertMessage");
        const severity = localStorage.getItem("alertSeverity");

        if (message) {
            showAlert(message, severity); // Display the alert with the stored message
            localStorage.removeItem("alertMessage"); // Clear the message from storage
            localStorage.removeItem("alertSeverity"); // Clear the severity from storage
        }

        axiosInstance
            .get("/tourist/tourist", { withCredentials: true })
            .then((response) => {
                setTourist(response.data);
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                    mobile: response.data.mobile || "",
                    nationality: response.data.nationality || "",
                    job: response.data.job || "",
                    address: response.data.address || [],
                    currency: response.data.currency || "",
                });
                setImage(response.data.picture || defaultImage);
                Cookies.set("profileImage", response.data.picture);
            })
            .catch((error) => {
                console.error("Error fetching tourist:", error);
            });

        fetchAllTags()
            .then((data) => setTags(data))
            .catch((error) => console.error("Error fetching tags:", error));
    }, []);

    // Render Preferences
    {
        tourist?.preferences && tourist.preferences.length > 0 ? (
            tourist.preferences.map((tag, index) => (
                <TagBubble key={index}>
                    {tag}
                    <CloseButton onClick={() => handleTagRemove(tag)}>×</CloseButton>
                </TagBubble>
            ))
        ) : (
            <p>No preferences available</p> // Add a message for when there are no preferences
        );
    }

    const handleImageClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = async (event) => {
        setIsEditing(true);
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            const image = await uploadFile(file, "tourist-profile-pictures");
            formData.append("picture", image);
            axiosInstance
                .put("/tourist/updateTourist", formData, {
                    withCredentials: true,
                })
                .then((response) => {
                    showAlert("Profile picture updated successfully!", "success");
                    setTourist((prev) => ({
                        ...prev,
                        picture: response.data.picture,
                    }));

                    setImage(response.data.picture);
                    console.log(
                        "Updated Tourist Profile Picture:",
                        response.data.picture
                    );
                    Cookies.set("profileImage", response.data.picture);
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000); // Alert will close after 5 seconds
                })
                .catch((error) => {
                    console.error("Error uploading picture:", error);
                    showAlert("An error occurred while uploading the picture.", "error");
                });
        }
    };
    const handleTagSelect = (event) => {
        const selectedTag = event.target.value;
        if (selectedTag && !selectedTags.includes(selectedTag)) {
            axiosInstance
                .post(
                    "/tourist/addPreference",
                    { preference: selectedTag },
                    { withCredentials: true }
                )
                .then((response) => {
                    // Store message in local storage before reload
                    localStorage.setItem("alertMessage", response.data.message);
                    localStorage.setItem("alertSeverity", "success");

                    // Reload the page
                    window.location.reload();
                    // Don't set selectedTags here, it's done after reload.
                })
                .catch((error) => {
                    console.error("Error adding preference:", error);
                    localStorage.setItem(
                        "alertMessage",
                        error.response?.data?.e ||
                            "An error occurred while adding preference."
                    );
                    localStorage.setItem("alertSeverity", "error");

                    // Reload the page without updating selectedTags
                    window.location.reload();
                });
        }
    };

    const handleTagRemove = (tagToRemove) => {
        const updatedSelectedTags = selectedTags.filter((tag) => tag !== tagToRemove);
        setSelectedTags(updatedSelectedTags);

        if (tourist?.preferences.includes(tagToRemove)) {
            axiosInstance
                .delete("/tourist/removePreference", {
                    data: { preference: tagToRemove },
                    withCredentials: true,
                })
                .then((response) => {
                    // Store message in local storage before reload
                    localStorage.setItem("alertMessage", response.data.message);
                    localStorage.setItem("alertSeverity", "success");

                    // Reload the page
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error removing preference:", error);
                    localStorage.setItem(
                        "alertMessage",
                        error.response?.data?.e ||
                            "An error occurred while removing preference."
                    );
                    localStorage.setItem("alertSeverity", "error");

                    // Reload the page without updating selectedTags
                    window.location.reload();
                });
        }
    };

    const handleRedeemPointsChange = (event) => {
        const points = Number(event.target.value);
        setPointsToRedeem(points);
        setRedeemValue(points * 0.01); // Example conversion
    };

    const handleRedeemPoints = () => {
        if (
            pointsToRedeem > 0 &&
            tourist &&
            tourist.loyalityPoints >= pointsToRedeem &&
            pointsToRedeem % 10000 === 0
        ) {
            axiosInstance
                .post(
                    "/tourist/redeemPoints",
                    { points: pointsToRedeem },
                    { withCredentials: true }
                )
                .then((response) => {
                    showAlert(response.data.message, "success"); // Use showAlert instead of alert
                    const updatedTourist = {
                        ...tourist,
                        loyalityPoints: tourist.loyalityPoints - pointsToRedeem,
                        wallet: tourist.wallet + redeemValue,
                    };
                    setTourist(updatedTourist);
                    setPointsToRedeem(0);
                    setRedeemValue(0);
                })
                .catch((error) => {
                    console.error("Error redeeming points:", error);
                    showAlert(
                        error.response?.data?.e ||
                            "An error occurred while redeeming points.",
                        "error" // Use showAlert instead of alert
                    );
                });
        } else if (pointsToRedeem === 0) {
            showAlert("Please enter a valid amount of points to redeem.", "warning"); // Use showAlert instead of alert
        } else if (tourist?.loyalityPoints < pointsToRedeem) {
            showAlert("Insufficient points for redemption.", "warning"); // Use showAlert instead of alert
        } else if (pointsToRedeem % 10000 !== 0) {
            showAlert("Please enter a multiple of 10000.", "warning"); // Use showAlert instead of alert
        } else {
            showAlert("Insufficient points for redemption or invalid input", "warning"); // Use showAlert instead of alert
        }
    };

    const handleEditProfileSubmit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "address") {
            // Always wrap the address input in an array
            setFormData((prev) => ({
                ...prev,
                address: [value], // Ensure it's a single-element array
            }));
        } else {
            // Handle other fields
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const [saveChangesLoading, setSaveChangesLoading] = useState(false);

    const handleSaveChanges = async () => {
        if (!formData.name || !formData.email) {
            showAlert("Please fill out all fields.", "warning");
            return;
        }

        // Create an object to hold the fields that have changed
        const editedFields = {};

        // Compare against an existing tourist object to determine changes
        for (const key in formData) {
            if (formData[key] !== tourist[key]) {
                editedFields[key] = formData[key]; // Only include fields that have changed
            }
        }

        // If no fields have changed, show an alert and return
        try {
            setSaveChangesLoading(true);
            const response = await axiosInstance.put(
                "/tourist/updateTourist",
                editedFields,
                {
                    withCredentials: true,
                }
            );
            try {
                const response = await axiosInstance.get("/tourist/tourist", {
                    withCredentials: true,
                });
                setTourist(response.data);
                showAlert("Profile updated successfully", "success");
                setIsEditing(false); // Exit editing mode
            } catch (error) {
                console.error("Error fetching updated tourist:", error);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            showAlert(
                error.response?.data?.e || "An error occurred while updating profile.",
                "error"
            );
        } finally {
            setSaveChangesLoading(false);
        }
    };

    const [newAddressName, setNewAddressName] = useState("");
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleAddAddress = () => {
        if (newAddressName.trim() !== "") {
            setFormData((prev) => ({
                ...prev,
                address: [
                    ...prev.address,
                    {
                        name: newAddressName,
                        address: location.location,
                        Latitude: location.latitude,
                        Longitude: location.longitude,
                    },
                ],
            }));
            setNewAddressName(""); // Clear name field
            setLocation({
                longitude: 0,
                latitude: 0,
                location: "",
            });
        } else {
            showAlert(
                "Please fill out both name and location for the address.",
                "warning"
            ); // Use showAlert instead of alert
        }
    };

    const handleRemoveAddress = (index) => {
        const updatedAddresses = formData.address.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            address: updatedAddresses,
        }));
    };

    const currentLevel = tourist
        ? tourist.points < 100000
            ? 1
            : tourist.points < 500000
            ? 2
            : 3
        : 1; // Default to level 1

    const handleDeleteAccount = () => {
        setIsDeleteConfirmationOpen(true);
    };

    const handleDeleteAccountConfirm = () => {
        axiosInstance
            .delete("/tourist/deleteTourist", { withCredentials: true })
            .then(() => {
                showAlert("Your account is deleted successfully", "success"); // Use showAlert instead of alert
                Cookies.remove("userType");
                setUserType("Guest");
                navigate("/");
            })
            .catch((error) => {
                const errorMessage =
                    error.response && error.response.data && error.response.data.message
                        ? error.response.data.message
                        : "An error occurred while deleting the account. Please try again.";

                console.error("Error deleting your account:", error);
                showAlert(errorMessage, "error"); // Use showAlert instead of alert
            });
    };

    const handleChangePassword = () => {
        setIsPopUpOpen(true);
    };

    const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
    const handleConfirmNewPasswordChange = (e) => setConfirmNewPassword(e.target.value);
    const handleUpdateCurrency = (newCurrency) => {
        setFormData((prev) => ({ ...prev, currency: newCurrency }));
    };

    const PopUpAction = () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            showAlert("Please fill out all fields.", "error"); // Use showAlert instead of alert
            return;
        }
        if (newPassword !== confirmNewPassword) {
            showAlert("New passwords do not match!", "warning"); // Use showAlert instead of alert
            return;
        }
        axiosInstance
            .patch(
                "/tourist/updatePassword",
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
                console.error("Error changing password:", error);
                showAlert("Old password is incorrect. Please try again.", "error"); // Use showAlert instead of alert
            });
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <>
            {isMapOpen && (
                <MapPopUp
                    popUpOpen={isMapOpen}
                    setPopUpOpen={setIsMapOpen}
                    mapFunction={mapFunction}
                />
            )}
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
                                        cursor: isEditing ? "pointer" : "default", // Pointer cursor only when isEditing is true
                                    }}
                                ></div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <strong>
                                    <p>{tourist?.name}</p>
                                </strong>
                                <p>@{tourist?.username}</p>
                            </ProfileImageContainer>

                            {/* Profile Details Section */}
                            <ProfileDetailsContainer>
                                <h2>Profile Details</h2>
                                {isEditing ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "1rem", // Add consistent spacing between elements
                                            width: "90%",
                                        }}
                                    >
                                        {[
                                            { label: "Name", name: "name", type: "text" },
                                            {
                                                label: "Email",
                                                name: "email",
                                                type: "email",
                                            },
                                            {
                                                label: "Mobile Number",
                                                name: "mobile",
                                                type: "text",
                                            },
                                            {
                                                label: "Nationality",
                                                name: "nationality",
                                                type: "text",
                                            },
                                            { label: "Job", name: "job", type: "text" },
                                        ].map(({ label, name, type }) => (
                                            <div
                                                key={name}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "1rem",
                                                }}
                                            >
                                                <strong>{label}:</strong>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    name={name}
                                                    label={label}
                                                    type={type}
                                                    value={formData[name]}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        ))}

                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "1rem",
                                            }}
                                        >
                                            <strong>Addresses:</strong>
                                            {formData.address.map((address, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <p style={{ width: "25%" }}>
                                                        {address.name}:{" "}
                                                    </p>
                                                    <p>
                                                        {address.address ||
                                                            "unknown address"}
                                                    </p>
                                                    <Button
                                                        stylingMode="always-light"
                                                        text="Remove"
                                                        handleClick={() =>
                                                            handleRemoveAddress(index)
                                                        }
                                                        customStyle={{
                                                            fontSize: "0.8rem",
                                                            padding: "0.8rem",
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "1rem",
                                                    alignItems: "center",
                                                    flexDirection: "column",
                                                    width: "100%",
                                                }}
                                            >
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    label="New Address Name"
                                                    sx={{ width: "100%" }}
                                                    value={newAddressName}
                                                    onChange={(e) =>
                                                        setNewAddressName(e.target.value)
                                                    }
                                                    style={{ flex: 1 }}
                                                />
                                                <LocationAdder
                                                    title={"pin on map"}
                                                    location={location}
                                                    styles={{ width: "100%" }}
                                                    setLocation={setLocation}
                                                    setMapFunction={setMapFunction}
                                                    fontWeight="500"
                                                    fontSize="1rem"
                                                />
                                                <Button
                                                    stylingMode="always-dark"
                                                    text="Add Address"
                                                    handleClick={handleAddAddress}
                                                    customStyle={{
                                                        width: "40%",
                                                        alignSelf: "center",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "1rem",
                                            }}
                                        >
                                            <strong>Preferred Currency:</strong>
                                            <CurrencyDropdown
                                                selectedCurrency={formData.currency}
                                                setSelectedCurrency={handleUpdateCurrency}
                                            />
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "100%",
                                                alignItems: "center",
                                                marginTop: "1.5rem",
                                            }}
                                        >
                                            <Button
                                                stylingMode="dark-when-hovered"
                                                text={"Cancel"}
                                                customStyle={{
                                                    width: "80%",
                                                }}
                                                handleClick={() => setIsEditing(false)}
                                            />

                                            <Button
                                                stylingMode="always-dark"
                                                text={"Save Changes"}
                                                handleClick={handleSaveChanges}
                                                customStyle={{
                                                    width: "80%",
                                                }}
                                                isLoading={saveChangesLoading}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p>
                                            <strong>Name:</strong>{" "}
                                            {tourist?.name || "Not Provided"}
                                        </p>
                                        <p>
                                            <strong>Email:</strong>{" "}
                                            {tourist?.email || "Not Provided"}
                                        </p>
                                        <p>
                                            <strong>Mobile:</strong>{" "}
                                            {tourist?.mobile || "Not Provided"}
                                        </p>
                                        <p>
                                            <strong>Nationality:</strong>{" "}
                                            {tourist?.nationality || "Not Provided"}
                                        </p>
                                        <p>
                                            <strong>Job:</strong>{" "}
                                            {tourist?.job || "Not Provided"}
                                        </p>
                                        <p>
                                            <strong>Addresses:</strong>{" "}
                                            {tourist?.address &&
                                            tourist.address.length > 0
                                                ? tourist.address.map((addr, index) => (
                                                      <span key={index}>
                                                          {addr.name}

                                                          {index <
                                                              tourist.address.length -
                                                                  1 && ", "}
                                                      </span>
                                                  ))
                                                : "Not Provided"}
                                        </p>
                                        <p>
                                            <strong>Preferred Currency:</strong>{" "}
                                            {tourist?.currency || "Not Provided"}
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
                        <PreferenceTagsBox>
                            <h3>Preference Tags</h3>
                            <Dropdown onChange={handleTagSelect} value="">
                                <option value="">Add Tags</option>
                                {Object.keys(tags).length > 0 ? (
                                    Object.keys(tags).map((key) => (
                                        <option key={key} value={tags[key]}>
                                            {tags[key]}
                                        </option>
                                    ))
                                ) : (
                                    <option>No tags available</option>
                                )}
                            </Dropdown>

                            <div style={{ marginTop: "10px" }}>
                                {/* Combine tourist.preferences, selectedTags, and render them without duplicates */}
                                {[
                                    ...(tourist?.preferences || []), // Existing preferences
                                    ...selectedTags, // Selected tags
                                ].map((tag, index) => (
                                    <TagBubble key={index}>
                                        {tag}
                                        <CloseButton onClick={() => handleTagRemove(tag)}>
                                            ×
                                        </CloseButton>
                                    </TagBubble>
                                ))}
                            </div>
                        </PreferenceTagsBox>
                    </InfoBoxesContainer>
                    <hr
                        style={{
                            width: "90%",
                            borderTop: "2px solid #ccc",
                            marginTop: "3vh",
                            marginBottom: "3vh",
                        }}
                    />
                    <InfoBoxesContainer>
                        <RedeemBox>
                            <LevelContainer>
                                <WalletIcon src="/wallet.png" alt="Wallet Icon" />
                            </LevelContainer>

                            <PointsSection>
                                <h3>Wallet Details</h3>
                                <p>Balance: {formatPrice(tourist?.wallet || 0)}</p>
                                <h3>My Points</h3>
                                <p>Points: {tourist?.loyalityPoints || 0}</p>
                                Level: {currentLevel}
                            </PointsSection>
                        </RedeemBox>
                        <RedeemBox>
                            <LevelContainer>
                                <WalletIcon
                                    src={levelImages[currentLevel]}
                                    alt={`Level ${currentLevel} Icon`}
                                />
                            </LevelContainer>
                            <LevelContainer>
                                <h3>Redeem Points</h3>
                                <h4>10K points → 100 EGP</h4>
                                <InputBox
                                    type="number"
                                    placeholder="Points"
                                    value={pointsToRedeem}
                                    onChange={handleRedeemPointsChange}
                                />
                                <Arrow>→</Arrow>
                                <InputBox
                                    type="text"
                                    placeholder="Value"
                                    value={redeemValue.toFixed(2)}
                                    readOnly
                                />
                                <LevelContainer>
                                    {" "}
                                    <Button
                                        stylingMode="always-dark"
                                        text="Redeem"
                                        handleClick={handleRedeemPoints}
                                    ></Button>
                                </LevelContainer>
                            </LevelContainer>
                        </RedeemBox>
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
                            <div
                                style={{
                                    width: "30vw",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <label>Current Password:</label>
                                <input
                                    type="password"
                                    name="Current Password"
                                    placeholder="Current Password"
                                    onChange={handleCurrentPasswordChange}
                                    value={currentPassword}
                                    style={{
                                        width: "60%", // Full width
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
                                    placeholder="New Password"
                                    onChange={handleNewPasswordChange}
                                    value={newPassword}
                                    style={{
                                        width: "60%", // Full width
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
                                    placeholder="Confirm New Password"
                                    onChange={handleConfirmNewPasswordChange}
                                    value={confirmNewPassword}
                                    style={{
                                        width: "60%", // Full width
                                        padding: "1vw", // Padding for better spacing
                                        marginBottom: "1vw", // Space between inputs
                                        border: "1px solid #ccc", // Border style
                                        borderRadius: "4px", // Rounded corners
                                    }}
                                />
                            </div>
                        </PopUp>
                    </ButtonContainer>
                </MainContent>

                <Footer />
            </PageWrapper>
        </>
    );
}
