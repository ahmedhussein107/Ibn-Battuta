/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import bg from "../../assets/images/bg.jpg";
import ProfileButton from "../../components/ProfileButtons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AdvertiserProfilePage = () => {
    const [response, setResponse] = useState(null);
    const [userType, setUserType] = useState("Advertiser");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        companyProfile: "",
        website: "",
        hotline: "",
    });
    const navigate = useNavigate();

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

    // Delete the advertiser account
    const handleDeleteAccountSubmit = () => {
        axiosInstance
            .delete("/advertiser/deleteAdvertiser", { withCredentials: true })
            .then(() => {
                alert("Advertiser account deleted successfully");
                Cookies.remove("userType");
                setUserType("Guest");
                navigate("/");
            })
            .catch((error) => {
                console.error("Error deleting Advertiser account:", error);
            });
    };

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <div
                    style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}
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
                        {/* Name and Username */}
                        <h2
                            style={{
                                marginTop: "-1vw",
                                marginLeft: "43%",
                                padding: "1vw",
                            }}
                        >
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            ) : (
                                response?.name || "Advertiser Name"
                            )}
                        </h2>
                        <p
                            style={{
                                color: "gray",
                                marginTop: "-3vw",
                                marginLeft: "46%",
                            }}
                        >
                            @{response?.username || "username"}
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
                            onClick={() => console.log("Change Password submitted")}
                        />
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
                <div style={{ position: "fixed", bottom: 0, width: "100%", left: 0 }}>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default AdvertiserProfilePage;
