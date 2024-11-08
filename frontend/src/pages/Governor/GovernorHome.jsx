import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "react-datetime/css/react-datetime.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import landmarkbackground from "../../assets/backgrounds/landmarksBackground.png";
import CardLandmark from "../../components/CardLandmark";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const GovernorHome = () => {
    const [landmarks, setLandmarks] = useState([]);

    const fetchLandmarks = async (query) => {
        try {
            console.log("query", query);
            const response = await axiosInstance.get(`/landmark/allLandmarks/`, {
                params: query,
            });
            console.log("response", response.data);
            setLandmarks(response.data);
        } catch (error) {
            console.error("Error fetching Activities:", error);
        }
    };

    useEffect(() => {
        fetchLandmarks();
    }, []);

    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            <div style={{ position: "fixed", top: 0, left: "9%", zIndex: 1 }}>
                <NavBar />
            </div>
            <div
                style={{
                    width: "100vw",
                    height: "30vh",
                    backgroundImage: `url(${landmarkbackground})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>
            <div
                style={{
                    position: "absolute",
                    top: "14vh",
                    left: "8vw",
                    fontSize: "8vh",
                    color: "white",
                    pointerEvents: "none",
                    fontFamily: "serif", // Try "" or "serif" for other options
                }}
            >
                My Landmarks
            </div>
            <div>
                <Button
                    style={{
                        marginLeft: "2vw",
                        borderRadius: "4vh",
                        minWidth: "2vw",
                        color: "black",
                        borderColor: "black",
                        maxHeight: "4.2vh",
                        marginTop: "1%",
                    }}
                    variant="outlined"
                    onClick={() => {
                        console.log("add landmark");
                    }}
                >
                    <AddIcon sx={{ fontSize: "3vh" }} />
                    <p style={{ marginLeft: ".3vw" }}>Add Landmark</p>
                </Button>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2vh",
                    alignItems: "center",
                }}
            >
                {landmarks.map((landmark) => {
                    return (
                        <div>
                            <CardLandmark
                                landmark={landmark}
                                width={"60vw"}
                                height={"35vh"}
                                firstLineButtons={[
                                    <EditIcon
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            console.log("edit landmark");
                                        }}
                                    />,
                                    <DeleteIcon
                                        style={{ color: "red", cursor: "pointer" }}
                                        onClick={() => {
                                            console.log("delete landmark");
                                        }}
                                    />,
                                ]}
                            />
                        </div>
                    );
                })}
            </div>
            <br />
            <Footer />
        </div>
    );
};

export default GovernorHome;
