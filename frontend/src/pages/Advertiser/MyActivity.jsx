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
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import CardActivity from "../../components/CardActivity";
import DeleteButton from "../../components/DeleteButton";
const MyActivity = () => {
    const navigate = useNavigate();

    const [activities, setActivities] = useState([]);
    const [searchedTerm, setSearchedTerm] = useState("");
    const [sortBy, setSortBy] = useState("Newest");

    const sortActivities = (activities) => {
        console.log("Sort By", sortBy);
        let sortedActivities = [...activities]; // Create a shallow copy
        if (sortBy === "Newest") {
            sortedActivities.sort(
                (a, b) => new Date(b.startDate) - new Date(a.startDate)
            );
        } else if (sortBy === "Oldest") {
            sortedActivities.sort(
                (a, b) => new Date(a.startDate) - new Date(b.startDate)
            );
        }
        console.log("sortedActivities", sortedActivities);
        setActivities(sortedActivities);
    };

    const fetchData = async (query) => {
        try {
            const response = await axiosInstance.get(
                `/activity/getAdvertiserActivities`,
                { params: query, withCredentials: true }
            );
            const data = response.data;
            sortActivities(data);
            console.log("response data is", data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const buildQuery = () => {
        const query = {};

        if (searchedTerm) {
            query.name = "~" + searchedTerm;
        }

        return query;
    };

    useEffect(() => {
        const query = buildQuery();
        fetchData(query);
    }, [searchedTerm]);

    useEffect(() => {
        sortActivities(activities);
    }, [sortBy]);

    const deleteActivityHandler = async (activityID) => {
        try {
            const response = await axiosInstance.delete(
                `activity/deleteActivity/${activityID}`
            );
            setActivities((prevActivities) =>
                prevActivities.filter((activity) => activity._id !== activityID)
            );
        } catch (error) {
            alert("Error deleting activity");
        }
    };

    return (
        <div style={{ position: "absolute", left: 0, top: 0 }}>
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
                    onClick={() => {
                        setSortBy((prev) => (prev === "Newest" ? "Oldest" : "Newest"));
                    }}
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
                        marginTop: "1%",
                        minHeight: "50vh",
                        minWidth: "100vw",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-evenly",
                    }}
                >
                    {activities.map((activity, index) => (
                        <div style={{ padding: "1.5vh" }}>
                            <CardActivity
                                activity={activity}
                                width={"46vw"}
                                height={"34vh"}
                                firstLineButtons={[
                                    <DeleteButton
                                        deleteHandler={deleteActivityHandler}
                                        ID={activity._id}
                                    />,
                                ]}
                                bottomButtons={[
                                    {
                                        text: "Edit",
                                        onClick: () =>
                                            navigate("/edit-activity", {
                                                state: activity,
                                            }),
                                        type: "1",
                                        width: "50%",
                                        styles: {
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: "0.5em",
                                        },
                                    },
                                ]}
                            />
                        </div>
                    ))}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default MyActivity;
