import React, { useEffect, useState } from "react";
import Welcome from "../../components/Welcome";
import { TextField } from "@mui/material";

import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Cookies from "js-cookie";

const SigninComponent = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState("");
    const [responseColor, setResponseColor] = useState("#000");

    const navigate = useNavigate();

    const hanldeClick = async (e) => {
        e.preventDefault();
        setResponseColor("#DC143C");
        if (!username) {
            setResponse("Please enter your username");
            return;
        }
        if (!password) {
            setResponse("Please enter your password");
            return;
        }
        try {
            const response = await axiosInstance.post(
                "/general/login",
                {
                    username,
                    password,
                },
                { withCredentials: true }
            );
            console.log(response.data);
            setResponseColor("#3CB371");
            setResponse("Login Successful! you will be redircted in a few seconds");
            setTimeout(() => {
                const userType = Cookies.get("userType");
                window.location.reload();

                if (userType === "Tourist") {
                    navigate("/");
                    return;
                }
                console.log("userType", userType.toLowerCase());
                navigate(`/${userType.toLowerCase()}`);
            }, 1000);
        } catch (err) {
            console.log(err);
            setResponse(err.response.data.message);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "50%",
                marginLeft: "20%",
                marginTop: "20%",
            }}
        >
            <h1
                style={{
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                    marginLeft: "20%",
                    fontWeight: "600",
                    color: "var(--accent-color)",
                }}
            >
                Sign in
            </h1>
            <p htmlFor="username" style={{ marginTop: "10%", fontWeight: "bold" }}>
                Username
            </p>
            <TextField
                id="username"
                variant="outlined"
                placeholder={"Please enter your username"}
                onChange={(e) => {
                    console.log("username", e.target.value);
                    setUsername(e.target.value);
                }}
                required={true}
            ></TextField>
            <p htmlFor="password" style={{ marginTop: "10%", fontWeight: "bold" }}>
                Password
            </p>
            <TextField
                id="password"
                variant="outlined"
                type="password"
                placeholder={"Please enter your password"}
                onChange={(e) => {
                    console.log("password", e.target.value);
                    setPassword(e.target.value);
                }}
                required={true}
            ></TextField>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: "10px",
                    color: "var(--accent-color)",
                    cursor: "pointer",
                }}
                onClick={() => {}}
            >
                <div>Forgot your password? </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    marginLeft: "25%",
                }}
            >
                <Button
                    stylingMode="always-dark"
                    text={"Sign in"}
                    handleClick={hanldeClick}
                    width={"10vw"}
                    customStyle={{ marginTop: "10%" }}
                />
                <p
                    style={{
                        color: responseColor,
                        width: "15vw",
                        textAlign: "center",
                        marginLeft: "-10%",
                    }}
                >
                    {response}
                </p>
            </div>
            <p
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "12%",
                    marginTop: "2vh",
                }}
            >
                Don't have an account?{" "}
                {
                    <Link to={"/select-your-role"}>
                        <p
                            style={{
                                width: "100%",
                                textDecoration: "underline",
                                marginTop: "-2%",
                                marginLeft: "16%",
                                color: "var(--accent-color)",
                            }}
                        >
                            Sign Up
                        </p>
                    </Link>
                }
            </p>
        </div>
    );
};

const Signin = () => {
    const navigate = useNavigate();
    // redirect the user if already logged in
    useEffect(() => {
        const userType = Cookies.get("userType") || "Guest";
        if (userType != "Guest") {
            navigate(`/${userType.replace(/\s+/g, "").toLowerCase()}`);
        }
    }, []);

    return (
        <div
            style={{
                position: "absolute",
                top: "0",
                left: "0",
                display: "flex",
                flexDirection: "row",
                width: "100vw",
                height: "100vh",
            }}
        >
            <div
                style={{
                    width: "55vw",
                    height: "100vh",
                    backgroundImage: `url("./auth.png")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <Welcome title={"Welcome Back"} />;
            </div>
            <div style={{ width: "45vw", height: "100vh" }}>
                <SigninComponent />
            </div>
        </div>
    );
};

export default Signin;
