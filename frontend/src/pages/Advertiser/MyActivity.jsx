import React, { useEffect, useState } from "react";
import i1 from "../../assets/images/i1.png";
import i2 from "../../assets/images/i2.png";
import NavBar from "../../components/NavBar";
import { Avatar } from "@mui/material";
import { orange } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";
import Footer from "../../components/Footer";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SwapVert from "@mui/icons-material/SwapVert";
import ActivityCard from "../../components/ActivityCard";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const MyActivity = () => {
    const navigate = useNavigate();

    const [activities, setActivities] = useState([]);
    const [searchedTerm, setSearchedTerm] = useState("");

    const fetchData = async (query) => {
        const advertiserID = Cookies.get("userId").replaceAll('"', "").substring(2);
        console.log("advertiserID", advertiserID);
        try {
            const response = await axiosInstance.get(
                `/activity/getAdvertiserActivities/${advertiserID}`,
                {
                    params: query,
                }
            );
            const data = response.data;
            setActivities(data);
            console.log("response sata is", data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchedTerm]);

    return (
        <div style={{ position: "absolute", left: 0, top: 0 }}>
            <div
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    zIndex: 1,
                    marginLeft: "23vw",
                    marginTop: "1vh",
                }}
            >
                <NavBar />
            </div>

            <div>
                <div style={{ position: "relative" }}>
                    <img
                        src={i1}
                        style={{
                            width: "100vw",
                            height: "35vh",
                            pointerEvents: "none",
                            zIndex: -1,
                        }}
                    />
                    <img
                        src={i2}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "35vh",
                            pointerEvents: "none",
                            zIndex: 0, // This will place the second image on top of the first
                        }}
                    />
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: "18vh",
                        left: "45vw",
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
                        left: "41vw",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <input
                            type="text"
                            placeholder="Search for activities"
                            value={searchedTerm}
                            onChange={(e) => setSearchedTerm(e.target.value)}
                            style={{
                                borderRadius: "4vh",
                                minWidth: "18vw",
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
                                width: "2.7vw",
                                height: "4.8vh",
                                marginLeft: "17.7vw",
                                marginTop: "-4.82vh",
                                bgcolor: orange[700],
                                cursor: "pointer", // TODO: resolve the bug
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
                        marginLeft: "2vw",
                        borderRadius: "4vh",
                        minWidth: "2vw",
                        color: "black",
                        borderColor: "black",
                        maxHeight: "4.2vh",
                    }}
                    variant="outlined"
                    onClick={() => {}}
                >
                    <SwapVert sx={{ fontSize: "3vh" }} />
                    <p style={{ marginLeft: ".3vw" }}>Sort by Date</p>
                </Button>
                <Button
                    style={{
                        marginLeft: "2vw",
                        borderRadius: "4vh",
                        minWidth: "1vw",
                        color: "black",
                        borderColor: "black",
                        maxHeight: "4.2vh",
                    }}
                    variant="outlined"
                    onClick={() => {
                        navigate("/create-activity");
                    }}
                >
                    <AddIcon sx={{ fontSize: "3vh" }} />
                    <p style={{ marginLeft: ".3vw" }}>Create Activity</p>
                </Button>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4vh",
                        padding: "3vh",
                        marginTop: "-1vh",
                    }}
                >
                    {activities.map((activity, index) => (
                        <div key={index} style={{ flex: "1 2 calc(50% - 2vh)" }}>
                            <ActivityCard activity={activity} />
                        </div>
                    ))}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default MyActivity;
