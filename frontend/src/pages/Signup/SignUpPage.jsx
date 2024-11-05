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
    const { userType } = location.state || { userType: "TourGuide" };
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

            // Create a preview URL for the selected image
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
        setIsLoading(true);
        try {
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
                const picture = await uploadFile(imageFile, "profilePictures");
                console.log("Picture uploaded:", picture);
                setUserData((prevData) => ({
                    ...prevData,
                    picture: picture,
                }));
            }
            if (file1) {
                const IdPath = await uploadFile(file1, "documents");
                let certificatesPath = await uploadFiles(file2, "documents");
                certificatesPath.push(IdPath);
                setUserData({ ...userData, documents: certificatesPath });
            }

            await axiosInstance.post(
                `/${userType.toLowerCase()}/create${userType}`,
                userData,
                {
                    withCredentials: true,
                }
            );
            // Handle the file upload logic here
            alert("Files submitted successfully!");
            console.log("File 1:", file1);
            console.log("Files 2:", file2);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1 style={{ textAlign: "center" }}>Sign Up</h1>

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
                                />
                                <label htmlFor="terms">
                                    I accept the
                                    <a href="https://google.com"> terms </a>
                                    and
                                    <a href="https://google.com"> conditions </a>
                                </label>
                            </div>
                        </div>
                    )}
                    <div className="button-group">
                        <Button
                            stylingMode="2"
                            text={"Previous"}
                            handleClick={handlepreviousStep}
                            disabled={step == 1}
                            isLoading={false}
                            customStyle={{
                                marginLeft: "20px",
                                width: "173px",
                                height: "55px",
                                minHieght: "70px",
                                borderRadius: "60px",
                            }}
                            type={"button"}
                        />

                        {step == 1 && (
                            <Button
                                stylingMode="2"
                                text={"Next"}
                                handleClick={handleNextStep}
                                disabbled={step == 2}
                                isLoading={false}
                                customStyle={{
                                    marginLeft: "20px",
                                    width: "173px",
                                    height: "55px",
                                    minHieght: "70px",
                                    borderRadius: "60px",
                                }}
                                type={"button"}
                            />
                        )}

                        {step == 2 && (
                            <Button
                                stylingMode="submit"
                                text={"Submit"}
                                handleClick={handleSubmit}
                                disabbled={isLoading}
                                isLoading={isLoading}
                                customStyle={{
                                    marginLeft: "20px",
                                    width: "173px",
                                    height: "55px",
                                    minHieght: "70px",
                                    borderRadius: "60px",
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
