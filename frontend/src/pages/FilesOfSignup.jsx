import React, { useState, useRef } from "react";
import "../styles/FilesOfSignup.css";
import FileInput from "../components/FileInput";
import { useNavigate } from "react-router-dom";
import { uploadFile, uploadFiles } from "../api/firebase";
import CommonFormStep from "./CommonForm";
import Button from "../components/Button";
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
    setFile2(Array.from(event.target.files)); // Convert FileList to array
  };

  const handleDeleteFile1 = () => {
    setFile1(null); // Reset file1
    if (fileInput1Ref.current) {
      fileInput1Ref.current.value = ""; // Clear the input field
    }
  };

  const handleDeleteFile2 = () => {
    setFile2([]); // Reset file2
    if (fileInput2Ref.current) {
      fileInput2Ref.current.value = ""; // Clear the input field
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
              <>
                <h3 style={{ textAlign: "center" }}>
                  Please upload Your ID and Certificates below
                </h3>
                <FileInput
                  label="Select ID file:"
                  onChange={handleFileChange1}
                  onDelete={handleDeleteFile1}
                  file={file1}
                  inputRef={fileInput1Ref}
                />

                <FileInput
                  label="Select certificate file(s):"
                  onChange={handleFileChange2}
                  onDelete={handleDeleteFile2}
                  file={file2.length > 0}
                  inputRef={fileInput2Ref}
                  multiple={true}
                />
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={handleTermsChange}
                  />
                  <label htmlFor="terms">
                    I accept the terms and conditions
                  </label>
                </div>
              </>
            )
          )}
          <div className="button-group">
            <Button
              stylingMode={2}
              text={"Previous"}
              handleClick={handlepreviousStep}
              customStyle={{
                marginLeft: "20px",
                width: "173px",
                height: "55px",
                minHieght: "70px",
                borderRadius: "60px",
              }}
            />
            {step == 1 && (
              <Button
                stylingMode={1}
                text={"Next"}
                handleClick={handleNextStep}
                customStyle={{
                  marginLeft: "20px",
                  width: "173px",
                  height: "55px",
                  minHieght: "70px",
                  borderRadius: "60px",
                }}
              />
            )}

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
