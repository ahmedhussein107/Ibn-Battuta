import React, { useState, useRef } from "react";
import "../../styles/SignUpPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { uploadFile, uploadFiles } from "../../api/firebase.js";
import CommonFormStep from "../../components/SignUp/CommonForm.jsx";
import Button from "../../components/Button.jsx";
import Page2 from "../../components/SignUp/Page2.jsx";
import TouristFields from "../../components/SignUp/TouristFields.jsx";
import axiosInstance from "../../api/axiosInstance.js";
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
        // Get the form element in the current step
        const form = document.querySelector("#form");

        // // Check if the form is valid
        // if (form && !form.checkValidity()) {
        // 	// Trigger the browser's built-in validation feedback
        // 	form.reportValidity();
        // 	return; // Prevent navigation to the next step if invalid
        // }

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            if (!userData.email || !userData.password || !userData.username) {
                alert("Please fill in all required fields.");
                return;
            }
            if (userData.password.length < 4) {
                alert("Password must be at least 4 characters long.");
                return;
            }
            if (!termsAccepted) {
                alert("You must accept the terms and conditions.");
            }
            if (userType === "Tourist" && (!userData.DOB || !userData.number)) {
                alert("Please fill in all required fields.");
                return;
            }
            if (userType !== "Tourist" && !file1) {
                alert("You must upload an ID file.");
                return;
            }
            if (userType !== "Tourist" && file2.length === 0) {
                alert(
                    "You must upload at least one certificate or taxation registery file."
                );
                return;
            }
            if (!termsAccepted) {
                alert("You must accept the terms and conditions.");
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

            console.log("Picture:", imageFile);
            console.log("User data:", userData);
            console.log("ahmed kamal", userData.picture);
            if (file1) {
                const IdPath = await uploadFile(file1, "documents");
                let certificatesPath = await uploadFiles(file2, "documents");
                certificatesPath.push(IdPath);
                userData.documents = certificatesPath;
            }

            const response = await axiosInstance.post(
                `/${userType.toLowerCase()}/create${userType}`,
                userData,
                { withCredentials: true }
            );
            // Handle the file upload logic here
            alert("Files submitted successfully!");
            console.log("File 1:", file1);
            console.log("Files 2:", file2);
            console.log("pict", imageFile);
            navigate("/signin");
        } catch (error) {
            setError(error.response.data.e);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    return (
        <div className="signup-container">
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
                            stylingMode="dark-when-hovered"
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
