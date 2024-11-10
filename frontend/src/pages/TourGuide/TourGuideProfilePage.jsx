/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import ProfileButton from "../../components/ProfileButtons";
import bg from "../../assets/images/bg.jpg";

const TourguideProfilePage = () => {
    const [response, setResponse] = useState(null);

    useEffect(() => {
        axiosInstance
            .get("/tourguide/getTourguideById", { withCredentials: true })
            .then((response) => {
                setResponse(response.data);
                console.log("Tourguide:", response.data);
                setResponse(response.data);
                console.log("Tourguide:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching Tourguide:", error);
            });
    }, []);

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
                    {/* Name and Username */}
                    <h2 style={{ marginTop: "0vw", marginLeft: "45%" }}>
                        {response?.name || "Admin Name"}
                    </h2>
                    <p style={{ color: "gray", marginTop: "-3vw", marginLeft: "47%" }}>
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
                        <h3>Profile Details</h3>
                        <p>
                            <strong>Email:</strong>{" "}
                            {response?.email || "No email provided"}
                        </p>
                        <p>
                            <strong>Mobile Number:</strong>{" "}
                            {response?.mobileNumber || "No mobile number provided"}
                        </p>
                        <p>
                            <strong>Years Of Experience:</strong>{" "}
                            {response?.yearsOfExperience ||
                                "No years of experience provided"}
                        </p>
                    </div>
                </div>
                <div>
                    <ProfileButton />
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
export default TourguideProfilePage;
