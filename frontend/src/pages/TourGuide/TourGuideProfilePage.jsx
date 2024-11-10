import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import bg from "../../assets/images/bg.jpg";
import ProfileButton from "../../components/ProfileButtons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const TourguideProfilePage = () => {
    const [response, setResponse] = useState(null);
    const [userType, setUserType] = useState("TourGuide");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        mobile: "",
        yearsOfExperience: "",
        previousWork: [],
    });
    const navigate = useNavigate();

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
                .put("/tourguide/updateTourGuide", formData, { withCredentials: true })
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

    const handleDeleteAccountSubmit = () => {
        axiosInstance
            .delete("/tourguide/deleteTourGuide", { withCredentials: true })
            .then(() => {
                alert("Tourguide account deleted successfully");
                Cookies.remove("userType");
                setUserType("Guest");
                navigate("/");
            })
            .catch((error) => {
                console.error("Error deleting Tourguide account:", error);
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
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </h2>
                    ) : (
                        <h2
                            style={{
                                marginTop: "-1vw",
                                marginLeft: "43%",
                                padding: "1vw",
                            }}
                        >
                            {response?.name || "Name not provided"}
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
                        <div style={{ marginBottom: "6vw" }}>
                            <h3>Previous Work</h3>
                            {formData.previousWork.map((work, index) => (
                                <div
                                    key={index}
                                    style={{
                                        border: "1px solid #ccc",
                                        padding: "1vw",
                                        marginBottom: "1vw",
                                        borderRadius: "8px",
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
                                            `${work.duration} months`
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
                                            work.description || "No description provided"
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
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
            <div style={{ position: "fixed", bottom: 0, width: "100vw", left: 0 }}>
                <Footer />
            </div>
        </>
    );
};

export default TourguideProfilePage;
