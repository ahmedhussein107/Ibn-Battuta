import React from "react";
import { color, styled } from "@mui/system"; // Or import styled from "styled-components" if using styled-components

// Base Button Style
const Button = styled("button")({
    padding: "10px 20px",
    fontSize: "13px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: 160,
});

// Specific Button Styles
const ChangePassword = styled(Button)({
    position: "absolute",
    top: "23vw",
    right: "14vw",
    height: 50,
    background: "white",
    borderRadius: 100,
    border: "1px black solid",
    color: "black",
});

const DeleteAccount = styled(Button)({
    position: "absolute",
    top: "23vw",
    right: "0vw",
    height: 50,
    background: "white",
    borderRadius: 100,
    border: "1px #D00C09 solid",
    color: "red",
});

const EditProfile = styled(Button)({
    position: "absolute",
    height: 50,
    right: "10vw",
    background: "white",
    borderRadius: 100,
    border: "1px black solid",
    color: "black",
});

// Main Button Component that conditionally renders based on buttonType prop
const ProfileButton = (props) => {
    return (
        <>
            <ChangePassword>Change Password</ChangePassword>
            <DeleteAccount>Delete Account</DeleteAccount>
            <EditProfile>Edit Profile</EditProfile>
        </>
    );
};

export default ProfileButton;
