import Button from "../../components/Button";
import "../../styles/SignUpPage.css";
import axiosInstance from "../../api/axiosInstance";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, TextField } from "@mui/material";
import PopUpSuccess from "../../components/PopUpsGeneric/PopUpSuccess";

const ForgotYourPassword = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [step, setStep] = useState(1);
    const [sendingOTP, setSendingOTP] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [verifyingOTP, setVerifyingOTP] = useState(false);
    const [verificationError, setVerificationError] = useState("");
    const [resentOTP, setResentOTP] = useState("");
    const [password, setPassword] = useState("");
    const [reenteredPassword, setReenteredPassword] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    const length = 6; // Number of OTP digits
    const [otp, setOtp] = useState(Array(length).fill(""));
    const inputs = useRef([]);

    const handleNext = async () => {
        if (!username) {
            setUsernameError("Please enter a username");
            return;
        }

        try {
            setSendingOTP(true);
            setUsernameError("");
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
        setVerificationError("");
        setResentOTP(true);
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
        setVerifyingOTP(true);
        setVerificationError("");
        setResentOTP(false);
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
        } finally {
            setVerifyingOTP(false);
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
        <div style={signupContainer}>
            <div style={formContainerStyle}>
                <div style={elementsStyle}>
                    <h1 style={{ color: "#9C4F21" }}>Change password</h1>

                    {step === 1 && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                //justifyContent: "center",
                                gap: "3vh",
                                marginTop: "5vh",
                            }}
                        >
                            <p
                                style={{
                                    textAlign: "center",
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                }}
                            >
                                Enter your username to change your password
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    //alignItems: "center",
                                    gap: "2vh",
                                    width: "100%",
                                }}
                            >
                                <TextField
                                    id="username"
                                    variant="outlined"
                                    label="Username"
                                    onChange={(e) => {
                                        console.log("username", e.target.value);
                                        setUsername(e.target.value);
                                    }}
                                    required={true}
                                    sx={{
                                        backgroundColor: "white", // Set the background to white
                                        borderRadius: "4px", // Optional: Add rounded corners
                                    }}
                                ></TextField>
                                {usernameError && (
                                    <Alert severity="error">{usernameError}</Alert>
                                )}
                            </div>

                            <div style={{ display: "flex", marginTop: "2vh" }}>
                                <Button
                                    text="Back"
                                    stylingMode="always-light"
                                    handleClick={() => {
                                        navigate("/signin");
                                    }}
                                />
                                <Button
                                    text="Next"
                                    stylingMode="always-dark"
                                    handleClick={() => {
                                        console.log("Button clicked");
                                        handleNext();
                                    }}
                                    isLoading={sendingOTP}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "3vh",
                                marginTop: "5vh",
                            }}
                        >
                            <p
                                style={{
                                    textAlign: "center",
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                }}
                            >
                                An OTP has been sent to your email address. Please verify
                                it to change your password.
                            </p>

                            <div
                                onPaste={handlePaste}
                                style={{
                                    display: "flex",
                                    gap: "3%",
                                    justifyContent: "center",
                                }}
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
                                            width: "3vw",
                                            height: "3vw",
                                            textAlign: "center",
                                            fontSize: "1.5rem",
                                        }}
                                    />
                                ))}
                            </div>

                            {verificationError !== "" && (
                                <Alert severity="error" style={{ width: "20vw" }}>
                                    {verificationError}
                                </Alert>
                            )}

                            {resentOTP && (
                                <Alert severity="info" style={{ width: "20vw" }}>
                                    {"Your OTP has been resent"}
                                </Alert>
                            )}

                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#9C4F21",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                }}
                                onClick={() => {
                                    handleResend();
                                }}
                            >
                                Resend OTP?
                            </button>

                            <div style={{ display: "flex" }}>
                                <Button
                                    text="Back"
                                    stylingMode="always-light"
                                    handleClick={() => {
                                        setUsername("");
                                        setResentOTP(false);
                                        setVerificationError("");
                                        setStep(1);
                                    }}
                                />
                                <Button
                                    text="Verify"
                                    stylingMode="always-dark"
                                    handleClick={() => {
                                        console.log(otp);
                                        handleVerify();
                                    }}
                                    isLoading={verifyingOTP}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "3vh",
                                marginTop: "5vh",
                                width: "50%",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "2vh",
                                    width: "100%",
                                }}
                            >
                                <p
                                    style={{
                                        textAlign: "center",
                                        fontSize: "1.2rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Enter you new password
                                </p>

                                <TextField
                                    id="password"
                                    variant="outlined"
                                    label="New Password"
                                    type="password"
                                    onChange={(e) => {
                                        console.log("password", e.target.value);
                                        setPassword(e.target.value);
                                    }}
                                    required={true}
                                    sx={{
                                        backgroundColor: "white", // Set the background to white
                                        borderRadius: "4px", // Optional: Add rounded corners
                                    }}
                                ></TextField>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "2vh",
                                    width: "100%",
                                }}
                            >
                                <p
                                    style={{
                                        textAlign: "center",
                                        fontSize: "1.2rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Re-enter you new password
                                </p>
                                <TextField
                                    id="password"
                                    variant="outlined"
                                    type="password"
                                    label="Confirm new password"
                                    onChange={(e) => {
                                        console.log("reentered password", e.target.value);
                                        setReenteredPassword(e.target.value);
                                    }}
                                    required={true}
                                    sx={{
                                        backgroundColor: "white", // Set the background to white
                                        borderRadius: "4px", // Optional: Add rounded corners
                                    }}
                                ></TextField>
                            </div>

                            {passwordMatchError && (
                                <Alert severity="error" style={{ width: "89%" }}>
                                    {passwordMatchError}
                                </Alert>
                            )}

                            <Button
                                text="Confirm"
                                stylingMode="always-dark"
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

const signupContainer = {
    color: "var(--text-color)",
    margin: "0",
    width: "100vw" /* Full viewport width */,
    height: "100vh" /* Full viewport height */,
    backgroundImage: `url(/auth.png)`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center" /* Center vertically */,
    justifyContent: "center" /* Center horizontally */,
    overflow: "visible",
};

const formContainerStyle = {
    background: "rgba(255, 255, 255, 0.8)" /* White background with transparency */,
    padding: "var(--spacing-large)",
    borderRadius: "var(--border-radius)" /* Rounded corners */,
    boxShadow:
        "0 4px 8px rgba(0, 0, 0, var(--opacity-transparent))" /* Slight shadow for depth */,
    width: "40%" /* Width relative to the parent div */,
    height: "fit-content",
    display: "flex",
    flexDirection: "column" /* Stack children vertically */,
};

const elementsStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10%",
};

export default ForgotYourPassword;
