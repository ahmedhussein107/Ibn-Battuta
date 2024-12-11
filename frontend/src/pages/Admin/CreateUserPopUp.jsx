import React from "react";
import PopUp from "../../components/PopUpsGeneric/PopUp";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import axiosInstance from "../../api/axiosInstance";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import "./UserManagement.css";
const CreateUserPopUp = ({ userType, isOpen, setIsOpen }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [popupAlert, setPopupAlert] = useState({
        open: false,
        severity: "info",
        message: "",
    });

    const handleSubmit = async () => {
        try {
            await axiosInstance.post(`${userType.toLowerCase()}/create${userType}`, {
                username,
                name: username,
                password,
            });
            showPopUpAlert("success", "User created successfully");
        } catch (err) {
            console.log(err);
            showPopUpAlert("error", err.response.data.message);
        } finally {
            //setIsOpen(false);
        }
    };

    const showPopUpAlert = (severity, message) => {
        setPopupAlert({ open: true, severity, message });

        setTimeout(() => {
            setPopupAlert({ open: false, severity: "", message: "" }); // Close the alert after some time
            setIsOpen(false);
        }, 4000); // Alert will close after 5 seconds
    };
    return (
        <PopUp
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            headerText={"Create " + userType}
            cancelText="Cancel"
            actionText="Create"
            handleSubmit={handleSubmit}
        >
            <div>
                <p style={{ fontWeight: "bold" }}>Username</p>
                <Box
                    component="form"
                    sx={{
                        "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="outlined-required"
                        label="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: "25vw",
                            height: "4vh",
                            marginTop: "1vh",
                            marginLeft: "0vw",
                            marginBottom: "2vh",
                        }}
                    />
                </Box>
                {/* <input
                    type="text"
                    placeholder="Enter the username"
                    onChange={(e) => setUsername(e.target.value)}
                /> */}
                <p style={{ fontWeight: "bold" }}>Password</p>
                <Box
                    component="form"
                    sx={{
                        "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="outlined-required"
                        label="Password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: "25vw",
                            height: "4vh",
                            marginTop: "1vh",
                            marginLeft: "0vw",
                            marginBottom: "2vh",
                        }}
                    />
                </Box>
                {popupAlert.open && (
                    <Alert
                        severity={popupAlert.severity}
                        onClose={() =>
                            setPopupAlert({
                                ...popupAlert,
                                open: false,
                            })
                        }
                        style={{
                            marginBottom: "1vh",
                            fontSize: "22px",
                            textAlign: "center",
                            marginTop: "2vh",
                        }}
                    >
                        {popupAlert.message}
                    </Alert>
                )}

                {/* <input
                    type="password"
                    placeholder="Enter the password"
                    onChange={(e) => setPassword(e.target.value)}
                /> */}
            </div>
        </PopUp>
    );
};

export default CreateUserPopUp;
