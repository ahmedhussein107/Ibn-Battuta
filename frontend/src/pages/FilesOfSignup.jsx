import React, { useState, useRef } from "react";
import "../styles/FilesOfSignup.css";
import { useNavigate } from "react-router-dom";
import { uploadFile, uploadFiles } from "../api/firebase";
import CommonFormStep from "./CommonForm";
import Button from "../components/Button";
import Page2 from "../components/SignUp/Page2";
const FilesOfSignup = () => {
    const [step, setSetp] = useState(1);
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState([]);
    const [userData, setUserData] = useState({});
    const [termsAccepted, setTermsAccepted] = useState(false);

    const fileInput1Ref = useRef(null);
    const fileInput2Ref = useRef(null);

    const navigate = useNavigate();
    const handleFileChange1 = (event) => {
        setFile1(event.target.files[0]);
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

        // Check if the form is valid
        if (form && !form.checkValidity()) {
            // Trigger the browser's built-in validation feedback
            form.reportValidity();
            return; // Prevent navigation to the next step if invalid
        }

        setSetp(step + 1);
    };
    const handlepreviousStep = () => {
        console.log("Current step before going back:", step); // Debug line
        if (step < 2) {
            navigate("/");
        } else {
            setSetp(step - 1);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file1) {
            alert("You must upload an ID file.");
            return;
        }
        if (file2.length === 0) {
            alert("You must upload at least one certificate file.");
            return;
        }
        if (!termsAccepted) {
            alert("You must accept the terms and conditions.");
            return;
        }
        const IdPath = await uploadFile(file1, "documents");
        let certificatesPath = await uploadFiles(file2, "documents");
        certificatesPath.push(IdPath);

        // send them;

        // Handle the file upload logic here
        alert("Files submitted successfully!");
        console.log("File 1:", file1);
        console.log("Files 2:", file2);
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1 style={{ textAlign: "center" }}>Sign Up</h1>

                <form onSubmit={handleSubmit} id="form">
                    {step == 1 ? (
                        <CommonFormStep userData={userData} onChange={handleChange} />
                    ) : (
                        step == 2 && (
                            <Page2
                                handleDeleteFile1={handleDeleteFile1}
                                handleDeleteFile2={handleDeleteFile2}
                                handleFileChange1={handleFileChange1}
                                handleFileChange2={handleFileChange2}
                                file1={file1}
                                file2={file2}
                                fileInput1Ref={fileInput1Ref}
                                fileInput2Ref={fileInput2Ref}
                                termsAccepted={termsAccepted}
                                handleTermsChange={handleTermsChange}
                            />
                        )
                    )}
                    <div className="button-group">
                        <Button
                            stylingMode={2}
                            text={"Previous"}
                            handleClick={handlepreviousStep}
                            disabled={step == 1}
                            customStyle={{
                                marginLeft: "20px",
                                width: "173px",
                                height: "55px",
                                minHieght: "70px",
                                borderRadius: "60px",
                            }}
                        />

                        <Button
                            stylingMode={1}
                            text={"Next"}
                            handleClick={handleNextStep}
                            disabbled={step == 2}
                            customStyle={{
                                marginLeft: "20px",
                                width: "173px",
                                height: "55px",
                                minHieght: "70px",
                                borderRadius: "60px",
                            }}
                        />

                        {step == 2 && (
                            <button className="submit-button" type="submit">
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FilesOfSignup;
