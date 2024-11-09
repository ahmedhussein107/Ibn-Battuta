import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";
import bg from "../../assets/images/bg.jpg";
import ProfileButton from "../../components/ProfileButtons";
import Footer from "../../components/Footer";
import Cookies from "js-cookie";

const GovernorProfilePage = () => {
    const [response, setResponse] = useState(null);
    const [userType, setUserType] = useState("Governor");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", username: "", email: "" });
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance
            .get("/governor/getGovernor", { withCredentials: true })
            .then((res) => {
                setResponse(res.data);
                // Set formData only after successfully fetching response
                setFormData({
                    name: res.data.name || "",
                    username: res.data.username || "",
                    email: res.data.email || "",
                });
            })
            .catch((error) => {
                console.error("Error fetching Governor:", error);
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
                    alert("Profile updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                });
        } else {
            // No changes made; close edit mode without saving
            setIsEditing(false);
            console.log("No changes to save");
        }
    };

    const handleDeleteAccountSubmit = () => {
        axiosInstance
            .delete("/governor/deleteGovernor", { withCredentials: true })
            .then(() => {
                alert("Governor account deleted successfully");
                Cookies.remove("userType");
                setUserType("Guest");
                navigate("/");
            })
            .catch((error) => {
                console.error("Error deleting governor account:", error);
            });
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
            <div style={{ position: "fixed", bottom: 0 }}>
                <Footer />
            </div>
        </>
    );
};

export default GovernorProfilePage;
