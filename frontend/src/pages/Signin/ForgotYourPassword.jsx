import Button from "../../components/Button";
import "../../styles/SignUpPage.css";
import axiosInstance from "../../api/axiosInstance";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import PopUpSuccess from "../../components/PopUpsGeneric/PopUpSuccess";

const ForgotYourPassword = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [step, setStep] = useState(1);
    const [sendingOTP, setSendingOTP] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [verificationError, setVerificationError] = useState("");
    const [password, setPassword] = useState("");
    const [reenteredPassword, setReenteredPassword] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    const length = 6; // Number of OTP digits
    const [otp, setOtp] = useState(Array(length).fill(""));
    const inputs = useRef([]);

    const handleNext = async () => {
        try {
            setSendingOTP(true);
            const response = await axiosInstance.post("/general/createOTP", {
                username,
            });
            console.log(response);
            setStep(2);
        } catch (err) {
            console.log(err);
            setUsernameError(err.response.data.message);
        } finally {
            setSendingOTP(false);
        }
    };

    const handleResend = async () => {
        try {
            const response = await axiosInstance.post("/general/createOTP", {
                username,
            });
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (value, index) => {
        // Update the OTP value in state
        const newOtp = [...otp];
        console.log(newOtp);
        newOtp[index] = value.slice(-1); // Only keep the last entered character
        setOtp(newOtp);

        // Focus on the next input box if the value is non-empty
        if (value && index < length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === "Backspace") {
            const newOtp = [...otp];
            newOtp[index] = ""; // Clear the current value
            setOtp(newOtp);

            // Focus on the previous input box if available
            if (index > 0) {
                inputs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (event) => {
        const data = event.clipboardData.getData("Text").slice(0, length);
        if (!/^\d+$/.test(data)) return; // Allow only numeric input

        const newOtp = data.split("").concat(Array(length - data.length).fill(""));
        setOtp(newOtp);

        // Automatically focus on the next empty input
        newOtp.forEach((digit, idx) => {
            if (digit && inputs.current[idx]) {
                inputs.current[idx].focus();
            }
        });
    };

    const handleVerify = async () => {
        const enteredOTP = otp.join("");
        console.log(enteredOTP);
        try {
            const response = await axiosInstance.post("/general/verifyOTP", {
                username,
                otp: enteredOTP,
            });
            console.log(response);
            setStep(3);
        } catch (err) {
            console.log(err);
            setVerificationError(err.response.data.message);
        }
    };

    const handleConfirm = async () => {
        if (password !== reenteredPassword) {
            setPasswordMatchError("Passwords do not match");
            return;
        } else if (password === "") {
            setPasswordMatchError("Please enter a password");
            return;
        }

        setPasswordMatchError("");
        setChangingPassword(true);
        try {
            const response = await axiosInstance.put("/general/changePassword", {
                username,
                newPassword: password,
            });
            console.log(response);
            setSuccessOpen(true);
        } catch (err) {
            console.log(err);
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="container">
            <div style={formContainerStyle}>
                <div style={elementsStyle}>
                    <h1 style={{ textAlign: "center" }}>Change your password</h1>

                    {step === 1 && (
                        <div style={elementsStyle}>
                            <p
                                style={{
                                    textAlign: "center",
                                    marginBottom: "5%",
                                    marginTop: "15%",
                                }}
                            >
                                Enter the username associated with your account to change
                                your password.
                            </p>

                            <div className="form-group">
                                <TextField
                                    id="username"
                                    variant="outlined"
                                    placeholder={"Please enter your username"}
                                    onChange={(e) => {
                                        console.log("username", e.target.value);
                                        setUsername(e.target.value);
                                    }}
                                    required={true}
                                    style={{ background: "white" }}
                                ></TextField>
                            </div>

                            <p
                                style={{
                                    color: "#DC143C",
                                    textAlign: "center",
                                    marginTop: "2%",
                                }}
                            >
                                {usernameError}
                            </p>

                            <Button
                                text="Next"
                                stylingMode="1"
                                handleClick={() => {
                                    console.log("Button clicked");
                                    handleNext();
                                }}
                                customStyle={{ marginTop: "10%" }}
                                isLoading={sendingOTP}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div style={elementsStyle}>
                            <p
                                style={{
                                    textAlign: "center",
                                    marginBottom: "5%",
                                    marginTop: "15%",
                                }}
                            >
                                We have sent an OTP to your email address. Please verify
                                it to change your password.
                            </p>

                            <div
                                onPaste={handlePaste}
                                style={{ display: "flex", gap: "10px" }}
                            >
                                {otp.map((_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={otp[index]}
                                        onChange={(e) =>
                                            handleChange(e.target.value, index)
                                        }
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        ref={(el) => (inputs.current[index] = el)} // Assign refs dynamically
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            textAlign: "center",
                                            fontSize: "18px",
                                        }}
                                    />
                                ))}
                            </div>

                            <p
                                style={{
                                    color: "#DC143C",
                                    textAlign: "center",
                                    marginTop: "2%",
                                }}
                            >
                                {verificationError}
                            </p>

                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#9C4F21",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    marginTop: "10%",
                                }}
                                onClick={() => {
                                    handleResend();
                                }}
                            >
                                Resend OTP?
                            </button>

                            <Button
                                text="Verify"
                                stylingMode="1"
                                handleClick={() => {
                                    console.log(otp);
                                    handleVerify();
                                }}
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div style={{ ...elementsStyle, marginTop: "5%" }}>
                            <div
                                className="form-group"
                                style={{ marginTop: "10%", gap: "50%" }}
                            >
                                <label>Enter your new password </label>
                                <TextField
                                    id="password"
                                    variant="outlined"
                                    type="password"
                                    placeholder={"New password"}
                                    onChange={(e) => {
                                        console.log("password", e.target.value);
                                        setPassword(e.target.value);
                                    }}
                                    required={true}
                                ></TextField>
                            </div>

                            <div className="form-group">
                                <label>Re-enter your new password </label>
                                <TextField
                                    id="password"
                                    variant="outlined"
                                    type="password"
                                    placeholder={"Confirm new password"}
                                    onChange={(e) => {
                                        console.log("reentered password", e.target.value);
                                        setReenteredPassword(e.target.value);
                                    }}
                                    required={true}
                                ></TextField>
                            </div>

                            <p
                                style={{
                                    color: "#DC143C",
                                    textAlign: "center",
                                    marginTop: "2%",
                                }}
                            >
                                {passwordMatchError}
                            </p>

                            <Button
                                text="Confirm"
                                stylingMode="1"
                                handleClick={() => {
                                    console.log("Button clicked");
                                    handleConfirm();
                                }}
                                customStyle={{ marginTop: "10%" }}
                                isLoading={changingPassword}
                            />

                            <PopUpSuccess
                                isOpen={successOpen}
                                setIsOpen={setSuccessOpen}
                                headerText={"Password changed successfully!"}
                                bodyText={
                                    "You will now be redirected to sign in using your new password."
                                }
                                handleOnClose={() => {
                                    navigate("/signin");
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const formContainerStyle = {
    background: "rgba(255, 255, 255, 0.8)" /* White background with transparency */,
    padding: "var(--spacing-large)",
    borderRadius: "var(--border-radius)" /* Rounded corners */,
    boxShadow:
        "0 4px 8px rgba(0, 0, 0, var(--opacity-transparent))" /* Slight shadow for depth */,
    width: "60%" /* Width relative to the parent div */,
    height: "55%",
    display: "flex",
    flexDirection: "column" /* Stack children vertically */,
};

const elementsStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
};

export default ForgotYourPassword;
