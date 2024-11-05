import React, { useEffect, useState } from "react";
import i2 from "../../assets/images/i2.png";
import i1 from "../../assets/images/iti.png";
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
const MyItinenrary = () => {
    // const [activity, setActivity] = useState([]);
    // useEffect(() => {
    //     // Fetch data from the backend when the component mounts
    //     const fetchData = async () => {
    //         try {
    //             const response = await axiosInstance.get(
    //                 "/activity/getActivity/670405f81ddb4f53fd971cd8"
    //             );
    //             const data = response.data;
    //             setActivity(data);
    //             console.log("response sata is", data);
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };

    //     fetchData();
    // }, []);
    // const activities = [
    //     activity,
    //     activity,
    //     activity,
    //     activity,
    //     activity,
    //     activity,
    //     activity,
    // ];
    return (
        <div>
            <div style={{ position: "fixed", left: "50vh", top: "2vh", zIndex: 1 }}>
                <NavBar />
            </div>

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
                    My Itinenrary
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
                            placeholder="Search for an Itinenrary"
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
                        marginTop: "35vh",
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
                        marginTop: "35vh",
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
                    <p style={{ marginLeft: ".3vw" }}>Create Itinenrary</p>
                </Button>
                {/* <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4vh",
                        padding: "3vh",
                        marginTop: "-1vh",
                        marginLeft: "0vh",
                    }}
                >
                    {activities.map((activity, index) => (
                        <div key={index} style={{ flex: "1 2 calc(50% - 2vh)" }}>
                            <ActivityCard activity={activity} />
                        </div>
                    ))}
                </div> */}
                <Footer />
            </div>
        </div>
    );
};

export default MyItinenrary;
