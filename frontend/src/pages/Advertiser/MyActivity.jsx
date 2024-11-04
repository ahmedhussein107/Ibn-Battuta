import React from "react";
import i1 from "../../assets/images/i1.png";
import i2 from "../../assets/images/i2.png";
import TextField from "@mui/material/TextField";
import NavBar from "../../components/NewNavBar";
import { Router } from "react-router-dom";
import { Avatar } from "@mui/material";
import PageviewIcon from "@mui/icons-material/Pageview";
import { orange } from "@mui/material/colors";
// iwant to import an icon for search bar
import SearchIcon from "@mui/icons-material/Search";
import Footer from "../../components/Footer";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SwapVert from "@mui/icons-material/SwapVert";
const MyActivity = () => {
    return (
        <div>
            <img
                src={i1}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "166.27vh",
                    height: "35%",
                    pointerEvents: "none",
                }}
            />
            <img
                src={i2}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "166.27vh",
                    height: "35%",
                    pointerEvents: "none",
                }}
            />

            {/* "My Activity" text above the search bar */}
            <div
                style={{
                    position: "absolute",
                    top: "17vh",
                    left: "74vh",
                    fontSize: "3.2vh",
                    fontWeight: "bold",
                    color: "White",
                    pointerEvents: "none",
                    // this is to prevent the text from being highlighted when clicked
                }}
            >
                My Activities
            </div>

            <div
                style={{
                    position: "absolute",
                    top: "24vh",
                    left: "67vh",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div>
                    <input
                        type="text"
                        placeholder="Search for activities"
                        style={{
                            borderRadius: "4vh",
                            minWidth: "30vh",
                            minHeight: "3vh",
                            backgroundColor: "white",
                            outline: "none",
                            padding: ".8vh 1.7vh",
                            fontSize: "1.8vh",
                        }}
                    />
                    <Avatar
                        sx={{
                            position: "absolute",
                            width: "4.8vh",
                            height: "4.8vh",
                            marginLeft: "29.6vh",
                            marginTop: "-4.82vh",
                            bgcolor: orange[700],
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            console.log("clicked");
                        }}
                    >
                        <SearchIcon />
                    </Avatar>
                </div>

                <div />
            </div>
            <Button
                style={{
                    marginTop: "-12vh",
                    marginLeft: "2.5vh",
                    borderRadius: "4vh",
                    minWidth: "15vh",
                    color: "black",
                    borderColor: "black",
                    maxHeight: "4.2vh",
                }}
                variant="outlined"
            >
                <SwapVert sx={{ fontSize: "3vh" }} />
                <p style={{ marginLeft: ".3vw" }}>Sort by Date</p>
            </Button>
            <Button
                style={{
                    marginTop: "-12vh",
                    marginLeft: "3vh",
                    borderRadius: "4vh",
                    minWidth: "15vh",
                    color: "black",
                    borderColor: "black",
                    maxHeight: "4vh",
                }}
                variant="outlined"
            >
                <AddIcon sx={{ fontSize: "3vh" }} />
                <p style={{ marginLeft: ".3vw" }}>Create Activity</p>
            </Button>
            <Footer />
        </div>
    );
};

export default MyActivity;
