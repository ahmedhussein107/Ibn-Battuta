import React, { useState, useRef } from "react";
import "../../styles/SignUpPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { uploadFile, uploadFiles } from "../../api/firebase.js";
import CommonFormStep from "../../components/SignUp/CommonForm.jsx";
import Button from "../../components/Button.jsx";
import Page2 from "../../components/SignUp/Page2.jsx";
import TouristFields from "../../components/SignUp/TouristFields.jsx";
import axiosInstance from "../../api/axiosInstance.js";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Alert } from "@mui/material";
const SignUpPage = () => {
    const location = useLocation();
    const { userType } = location.state;

    const [error, setError] = useState(null);
    const [step, setSetp] = useState(1);
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState(null);
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [SeverError, setServerError] = useState("");
    const fileInput1Ref = useRef(null);
    const fileInput2Ref = useRef(null);
    const imageRef = useRef(null);

    const navigate = useNavigate();
    const handleFileChange1 = (event) => {
        setFile1(event.target.files[0]);
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(" I changed Image");
        if (file) {
            setImageFile(file); // Update the state with the raw file

            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result); // Update the state for the image preview
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange2 = (event) => {
        setFile2(Array.from(event.target.files));
    };

    const handleDeleteFile1 = () => {
        setFile1(null); // Reset file1
        if (fileInput1Ref.current) {
            fileInput1Ref.current.value = "";
        }
    };
    const handleImageDelete = () => {
        setImageFile(null);
        setImage(null);
        if (imageRef.current) {
            imageRef.current.value = "";
        }
    };

    const handleDeleteFile2 = () => {
        setFile2([]); // Reset file2
        if (fileInput2Ref.current) {
            fileInput2Ref.current.value = "";
        }
    };

    const handleTermsChange = () => {
        setTermsAccepted(!termsAccepted);
    };
    const handleNextStep = () => {
        const form = document.querySelector("#form");

        if (!userData.email || !userData.password || !userData.username) {
            setAlertMessage("Please fill in all required fields. ");
            setShowAlert(true);
            setServerError("error");
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
            return;
            return;
        }

        setSetp(step + 1);
    };
    const handlepreviousStep = () => {
        console.log("Current step before going back:", step); // Debug line
        if (step < 2) {
            navigate("/select-your-role");
        } else {
            setSetp(step - 1);
        }
    };
    const convertToDate = (dateObj) => {
        if (!dateObj || !dateObj.year || !dateObj.month || !dateObj.day) {
            return null;
        }

        // Create new date - subtract 1 from month since JavaScript months are 0-based
        return new Date(
            parseInt(dateObj.year),
            parseInt(dateObj.month) - 1, // Convert "02" to 1 (February)
            parseInt(dateObj.day)
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            if (!userData.email || !userData.password || !userData.username) {
                setAlertMessage("Please fill in all required fields. ");
                setShowAlert(true);
                setServerError("error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000);
                return;
            }
            if (userData.password.length < 4) {
                setAlertMessage("Password must be at least 4 characters long.");
                setShowAlert(true);
                setServerError("error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000);
                return;
            }
            if (!termsAccepted) {
                setAlertMessage("You must accept the terms and conditions.");
                setShowAlert(true);
                setServerError("error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000);
                return;
            }

            if (userType === "Tourist" && (!userData.DOB || !userData.mobile)) {
                setAlertMessage("Please fill in all required fields. ");
                setShowAlert(true);
                setServerError("error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000);
                return;
            }
            if (userType !== "Tourist" && !file1) {
                setAlertMessage("You must upload an ID file.");
                setShowAlert(true);
                setServerError("error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000);
                return;
            }
            if (userType !== "Tourist" && file2.length === 0) {
                setAlertMessage(
                    "You must upload at least one certificate or taxation registery file."
                );
                setShowAlert(true);
                setServerError("error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000);
                return;
                return;
            }
            if (!termsAccepted) {
                setAlertMessage("You must accept the terms and conditions.");
                setShowAlert(true);
                setServerError("error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000);
                return;
            }
            if (imageFile) {
                console.log("ana hna");
                const picture = await uploadFile(imageFile, "profilePictures");
                console.log("Picture uploaded:", picture);
                userData.picture = picture;
            }
            /// i want to sleep 1 sec
            setTimeout(() => {
                console.log("I'm done sleeping!");
                console.log("ahmed kamal", userData.picture);
            }, 4000);
            if (file1) {
                const IdPath = await uploadFile(file1, "documents");
                let certificatesPath = await uploadFiles(file2, "documents");
                certificatesPath.push(IdPath);
                userData.documents = certificatesPath;
            }

            if (userData.DOB) {
                userData.DOB = convertToDate(userData.DOB);
            }
            const response = await axiosInstance.post(
                `/${userType.toLowerCase()}/create${userType}`,
                userData,
                { withCredentials: true }
            );
            console.log("111");
            // setAlertMessage("Files submitted successfully!");
            setAlertMessage("Account created successfully!");
            setShowAlert(true);
            setServerError("success");
            setTimeout(() => {
                setShowAlert(false);
                navigate("/signin");
            }, 3000);
        } catch (error) {
            setError(error.response.data.e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    return (
        <div className="signup-container">
            {showAlert && (
                <Alert
                    severity={SeverError}
                    onClose={() => setShowAlert(false)}
                    style={{
                        position: "fixed",
                        right: "1%",
                        bottom: "1vh",
                        zIndex: 1000,
                    }}
                >
                    {alertMessage}
                </Alert>
            )}
            <div className="form-container">
                <h1 style={{ textAlign: "center", color: "var(--accent-color)" }}>
                    Sign Up
                </h1>

                <form onSubmit={handleSubmit} id="form" className="form">
                    {step == 1 && (
                        <CommonFormStep
                            userData={userData}
                            onChange={handleChange}
                            handleImageChange={handleImageChange}
                            handleImageDelete
                            image={image}
                        />
                    )}

                    {step == 2 &&
                        (userType == "Tourist" ? (
                            <TouristFields onChange={handleChange} userData={userData} />
                        ) : (
                            <Page2
                                handleDeleteFile1={handleDeleteFile1}
                                handleDeleteFile2={handleDeleteFile2}
                                handleFileChange1={handleFileChange1}
                                handleFileChange2={handleFileChange2}
                                file1={file1}
                                file2={file2}
                                fileInput1Ref={fileInput1Ref}
                                fileInput2Ref={fileInput2Ref}
                                isTourGuide={userType == "TourGuide"}
                            />
                        ))}

                    {step == 2 && (
                        <div className="checkbox-container">
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={termsAccepted}
                                    onChange={handleTermsChange}
                                    style={{ accentColor: "var(--accent-color)" }}
                                />
                                <label htmlFor="terms">
                                    I accept the
                                    <a
                                        href="/privacy"
                                        target="_blank"
                                        style={{ color: "var(--accent-color)" }}
                                    >
                                        {" "}
                                        terms and conditions{" "}
                                    </a>
                                </label>
                            </div>
                        </div>
                    )}
                    <p className="signup-error">{error}</p>

                    <div className="button-group">
                        <Button
                            stylingMode="always-light"
                            text={"Previous"}
                            handleClick={handlepreviousStep}
                            disabled={step == 1}
                            isLoading={false}
                            customStyle={{
                                marginLeft: "20px",
                            }}
                            width="8vw"
                            type={"button"}
                        />

                        {step == 1 && (
                            <Button
                                stylingMode="always-dark"
                                text={"Next"}
                                handleClick={handleNextStep}
                                disabled={step == 2}
                                isLoading={false}
                                width="8vw"
                                customStyle={{
                                    marginLeft: "20px",
                                }}
                                type={"button"}
                            />
                        )}

                        {step == 2 && (
                            <Button
                                stylingMode="always-dark"
                                text={"Submit"}
                                handleClick={handleSubmit}
                                disabled={isLoading}
                                width="8vw"
                                isLoading={isLoading}
                                customStyle={{
                                    marginLeft: "20px",
                                }}
                            />
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
