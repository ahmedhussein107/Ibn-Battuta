import React from "react";
import Welcome from "../../components/Welcome";
import { TextField } from "@mui/material";

import TravellerBackground from "../../assets/backgrounds/travellerBackground.png";

const RightHalf = () => {
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
                }}
            >
                Sign in
            </h1>
            <p style={{ marginTop: "10%", fontWeight: "bold" }}>Username</p>
            <TextField
                variant="outlined"
                placeholder={"Please enter your username"}
            ></TextField>
            <p style={{ marginTop: "10%", fontWeight: "bold" }}>Password</p>
            <TextField
                variant="outlined"
                placeholder={"Please enter your password"}
            ></TextField>
        </div>
    );
};

const SelectYourRole = () => {
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
                    backgroundImage: `url(${TravellerBackground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <Welcome title={"Welcome"} />;
            </div>
            <div style={{ width: "45vw", height: "100vh" }}>
                <RightHalf />
            </div>
        </div>
    );
};

export default SelectYourRole;
