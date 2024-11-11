import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";
import styled from "styled-components";
import { fetchAllTags } from "../../pages/Tag/fetchAllTags";
import Footer from "../../components/Footer";
import bg from "../../assets/images/bg.jpg";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import { uploadFile } from "../../api/firebase";
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
    gap: 2vh; /* Space between buttons */
    margin-top: 3vh; /* Adjusted to create space below the header */
    position: relative;
    margin-left: 70vw; /* Pushes the container to the left */
`;

const Button = styled.button`
    padding: 1vh 2vh;
    font-size: 1.5vh;
    font-weight: bold;
    border: none;
    border-radius: 0.5vh;
    cursor: pointer;
    padding: 1vh 2vh;
    font-size: 1.5vh;
    font-weight: bold;
    border: none;
    border-radius: 0.5vh;
    cursor: pointer;
`;

const ChangePassword = styled(Button)`
    width: 20vh;
    height: 5vh;
    background: white;
    border-radius: 20vh;
    border: 0.1vh solid black;
    color: black;
    width: 20vh;
    height: 5vh;
    background: white;
    border-radius: 20vh;
    border: 0.1vh solid black;
    color: black;
`;

const DeleteAccount = styled(Button)`
    width: 20vh;
    height: 5vh;
    background: white;
    border-radius: 20vh;
    border: 0.1vh solid #d00c09;
    color: red;
    width: 20vh;
    height: 5vh;
    background: white;
    border-radius: 20vh;
    border: 0.1vh solid #d00c09;
    color: red;
`;

const EditProfile = styled.button`
    width: 20vh;
    height: 5vh;
    background: white;
    border-radius: 100px;
    border: 0.1vh solid black;
    color: black;
    margin-left: 75%; /* This pushes the button to the right within its flex container */
`;

const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    margin-top: 10px; /* Pushes content below the overlapping profile image */
`;

const ProfileDetailsBox = styled.div`
    width: 831px;
    background: white;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    padding: 20px;
    position: relative;
`;

const InfoBoxesContainer = styled.div`
    display: flex;
    gap: 20px;
    margin-top: 20px;
`;

const WalletBox = styled.div`
    width: 378px;
    background: white;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    padding: 20px;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
`;

const WalletHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-direction: row;
`;

const WalletIcon = styled.img`
    width: 100px; // New size for the icon
    height: 100px; // New size for the icon
`;
const LevelContainer = styled.div`
    font-size: 16px;
    color: black; /* Optional color change */
    flex-direction: column; /* Stack level text and progress bar vertically */
`;
const levelImages = {
    1: "level1.png", // Replace with actual path for Level 1
    2: "level2.png", // Replace with actual path for Level 2
    3: "level3.png", // Replace with actual path for Level 3
};

const PointsSection = styled.div`
    margin-top: 10px;
    font-size: 16px;
    flex-direction: row;
`;

const RedeemBox = styled.div`
    width: 378px;
    background: white;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    padding: 20px;
    text-align: center;
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

const RedeemButton = styled.button`
    padding: 10px 20px;
    background-color: #f86624;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-top: 10px;
`;

const PreferenceTagsBox = styled.div`
    width: 831px;
    background: white;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    padding: 20px;
    text-align: center;
    margin-top: 20px;
`;

const TagBubble = styled.span`
    display: inline-flex;
    align-items: center;
    background-color: #ffe0cc;
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
    margin-top: 10px;
    padding: 5px;
`;

export default function TouristProfilePage() {
    const [tourist, setTourist] = useState(null);
    const [userType, setUserType] = useState("Tourist");
    const [tag, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [redeemValue, setRedeemValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
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
                    <CloseButton onClick={() => handleTagRemove(tag)}>
                        ×
                    </CloseButton>
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
                    alert("Profile picture updated successfully!");
                    console.log(
                        "Updated Tourist Picture:",
                        response.data.picture
                    );

                    // Ensure response.data contains the full URL of the picture
                    setTourist((prev) => ({
                        ...prev,
                        picture: response.data.picture, // This should be a string URL
                    }));

                    // Log the updated tourist picture to the console
                    console.log(
                        "Updated Tourist Picture:",
                        response.data.picture
                    );
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error uploading picture:", error);
                    alert("An error occurred while uploading the picture.");
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
                    alert(response.data.message);
                    setSelectedTags([...selectedTags, selectedTag]);
                })
                .catch((error) => {
                    console.error("Error adding preference:", error);
                    alert(
                        error.response?.data?.e ||
                            "An error occurred while adding preference."
                    );
                });
        }
    };

    const handleTagRemove = (tagToRemove) => {
        const updatedSelectedTags = selectedTags.filter(
            (tag) => tag !== tagToRemove
        );
        setSelectedTags(updatedSelectedTags);

        if (tourist?.preferences.includes(tagToRemove)) {
            axiosInstance
                .delete("/tourist/removePreference", {
                    data: { preference: tagToRemove },
                    withCredentials: true,
                })
                .then((response) => {
                    alert(response.data.message);
                    const updatedPreferences = tourist.preferences.filter(
                        (tag) => tag !== tagToRemove
                    );
                    setTourist({ ...tourist, preferences: updatedPreferences });
                })
                .catch((error) => {
                    console.error("Error removing preference:", error);
                    alert(
                        error.response?.data?.e ||
                            "An error occurred while removing preference."
                    );
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
                    alert(response.data.message);
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
                    alert(
                        error.response?.data?.e ||
                            "An error occurred while redeeming points."
                    );
                });
        } else if (pointsToRedeem === 0) {
            alert("Please enter a valid amount of points to redeem.");
        } else if (tourist?.loyalityPoints < pointsToRedeem) {
            alert("Insufficient points for redemption.");
        } else if (pointsToRedeem % 10000 !== 0) {
            alert("Please enter a multiple of 10000.");
        } else {
            alert("Insufficient points for redemption or invalid input");
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
    const handleSaveChanges = () => {
        if (!formData.name || !formData.email) {
            alert("Please fill out all fields.");
            return;
        }

        axiosInstance
            .put("/tourist/updateTourist", formData, {
                withCredentials: true,
            })
            .then(() => {
                // Re-fetch the tourist data to ensure it's updated
                axiosInstance
                    .get("/tourist/tourist", { withCredentials: true })
                    .then((response) => {
                        setTourist(response.data); // Update tourist state with the fresh data
                        alert("Profile updated successfully");
                        setIsEditing(false); // Switch back to non-editing mode
                    })
                    .catch((error) => {
                        console.error("Error fetching updated tourist:", error);
                    });
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                alert(
                    error.response?.data?.e ||
                        "An error occurred while updating profile."
                );
            });
    };

    const [newAddressName, setNewAddressName] = useState("");
    const [newAddressLocation, setNewAddressLocation] = useState("");
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
        useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleAddAddress = () => {
        if (newAddressName.trim() !== "" && newAddressLocation.trim() !== "") {
            setFormData((prev) => ({
                ...prev,
                address: [
                    ...prev.address,
                    { name: newAddressName, location: newAddressLocation },
                ],
            }));
            setNewAddressName(""); // Clear name field
            setNewAddressLocation(""); // Clear location field
        } else {
            alert("Please fill out both name and location for the address.");
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
                alert("Your account is deleted successfully");
                Cookies.remove("userType");
                setUserType("Guest");
                navigate("/");
            })
            .catch((error) => {
                console.error("Error deleting Your account:", error);
            });
    };

    const handleChangePassword = () => {
        setIsPopUpOpen(true);
    };

    const handleCurrentPasswordChange = (e) =>
        setCurrentPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
    const handleConfirmNewPasswordChange = (e) =>
        setConfirmNewPassword(e.target.value);

    const PopUpAction = () => {
        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match!");
            return;
        }
        axiosInstance
            .patch(
                "/tourist/updatePassword",
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
                console.error("Error changing password:", error);
                alert("Old password is incorrect. Please try again.");
            });
    };

    return (
        <PageWrapper>
            <div
                style={{
                    width: "100vw",
                    height: "40vh",
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "100% 100%",
                    // backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    Top: "0vh",
                    //paddingtop: "10vh",
                }}
            ></div>
            <Navbar />
            <div
                onClick={handleImageClick}
                style={{
                    width: "10vw",
                    height: "10vw",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "4px solid white",
                    marginTop: "-6vh",
                    backgroundImage: `url(${
                        tourist?.picture
                            ? tourist.picture
                            : "https://img.freepik.com/premium-photo/stylish-man-flat-vector-profile-picture-ai-generated_606187-310.jpg"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer", // Make it look clickable
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
                <p>{tourist?.name}</p>{" "}
            </strong>
            <p>@{tourist?.username}</p>{" "}
            <ButtonContainer>
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
            </ButtonContainer>
            <hr
                style={{
                    width: "90%",
                    borderTop: "2px solid #ccc",
                    marginTop: "1vh",
                    marginLeft: "5vw",
                }}
            />
            <MainContent>
                <InfoBoxesContainer>
                    <ProfileDetailsBox>
                        <h2>Profile Details</h2>
                        {isEditing ? (
                            <div>
                                <strong>Name:</strong>{" "}
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <p>
                                    <strong>Email:</strong>{" "}
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </p>
                                <p>
                                    <strong>Mobile Number:</strong>{" "}
                                    <input
                                        type="text"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                    />
                                </p>
                                <p>
                                    <strong>Nationality:</strong>{" "}
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                    />
                                </p>
                                <p>
                                    <strong>Job:</strong>{" "}
                                    <input
                                        type="text"
                                        name="job"
                                        value={formData.job}
                                        onChange={handleChange}
                                    />
                                </p>
                                <p>
                                    <strong>Addresses:</strong>{" "}
                                    {formData.address.map((address, index) => (
                                        <div key={index}>
                                            <span>
                                                {address.name} -{" "}
                                                {address.location}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleRemoveAddress(index)
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    {/* Address input fields */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Address Name"
                                            value={newAddressName}
                                            onChange={(e) =>
                                                setNewAddressName(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="Address Location"
                                            value={newAddressLocation}
                                            onChange={(e) =>
                                                setNewAddressLocation(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button onClick={handleAddAddress}>
                                            Add Address
                                        </button>
                                    </div>
                                </p>
                                <p>
                                    <strong>Preferred Currency:</strong>{" "}
                                    <input
                                        type="text"
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                    />
                                </p>
                                <p>
                                    <button onClick={handleSaveChanges}>
                                        Save Changes
                                    </button>
                                </p>
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
                                                  {addr.name} - {addr.location}
                                                  {index <
                                                      tourist.address.length -
                                                          1 && ", "}{" "}
                                                  {/* Add a comma except after the last address */}
                                              </span>
                                          ))
                                        : "Not Provided"}
                                </p>

                                <p>
                                    <strong>Preferred Currency:</strong>{" "}
                                    {tourist?.currency || "Not Provided"}
                                </p>
                                <EditProfile onClick={handleEditProfileSubmit}>
                                    Edit Profile
                                </EditProfile>
                            </>
                        )}
                    </ProfileDetailsBox>
                    <WalletBox>
                        <WalletHeader>
                            <h3>Wallet Details</h3>
                            <WalletIcon src="image 55.png" alt="Wallet Icon" />
                        </WalletHeader>

                        <PointsSection>
                            <p>Balance: {tourist?.wallet || 0}</p>
                            <h3>My Points</h3>
                            <p>Points: {tourist?.loyalityPoints || 0}</p>
                            Level: {currentLevel}
                            <LevelContainer>
                                <WalletIcon
                                    src={levelImages[currentLevel]}
                                    alt={`Wallet Level ${currentLevel} Icon`}
                                />
                            </LevelContainer>
                        </PointsSection>
                    </WalletBox>
                </InfoBoxesContainer>
                <InfoBoxesContainer>
                    <PreferenceTagsBox>
                        <h3>Preference Tags</h3>
                        <Dropdown onChange={handleTagSelect} value="">
                            <option value="">Add Tags</option>
                            {Object.keys(tag).length > 0 ? (
                                Object.keys(tag).map((key) => (
                                    <option key={key} value={tag[key]}>
                                        {tag[key]}
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
                                    <CloseButton
                                        onClick={() => handleTagRemove(tag)}
                                    >
                                        ×
                                    </CloseButton>
                                </TagBubble>
                            ))}
                        </div>
                    </PreferenceTagsBox>

                    <RedeemBox>
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
                        <RedeemButton onClick={handleRedeemPoints}>
                            Redeem
                        </RedeemButton>
                    </RedeemBox>
                </InfoBoxesContainer>
            </MainContent>
            <Footer />
        </PageWrapper>
    );
}
