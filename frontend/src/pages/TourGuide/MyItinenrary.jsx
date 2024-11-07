import React, { useEffect, useState } from "react";
import i2 from "../../assets/images/i2.png";
import i1 from "../../assets/images/iti.png";
import NavBar from "../../components/NavBar";
import { Avatar, Button, Grid } from "@mui/material";
import { orange } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Footer from "../../components/Footer";
import AddIcon from "@mui/icons-material/Add";
import SwapVert from "@mui/icons-material/SwapVert";
import ItineraryCard from "../../components/ItineraryCard";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CardItinerary from "../../components/CardItinerary";
import travellerBackground from "../../assets/backgrounds/travellerBackground.png";

const DeleteButton = ({ deleteItineraryHandler, itineraryID }) => {
    const [isDeleteHovered, setIsDeleteHovered] = useState(false);
    return (
        <DeleteOutlineIcon
            style={{
                padding: "0.8vw 1.6vh",
                color: "red",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "3.5vh",
                borderRadius: "2vh",
                backgroundColor: isDeleteHovered ? "#ffe6e6" : "transparent",
                transition: "background-color 0.25s",
            }}
            onMouseEnter={() => setIsDeleteHovered(true)}
            onMouseLeave={() => setIsDeleteHovered(false)}
            onClick={() => deleteItineraryHandler(itineraryID)}
        />
    );
};

const MyItinenrary = () => {
    const navigate = useNavigate();

    const [itineraries, setitineraries] = useState([
        {
            language: "Arabic",
            location: "Cairo, Egypt",
            accessibility: ["Wheelchair", "Acc"],
            name: "Tour in GUC",
            price: 1000,
            availableDatesAndTimes: ["2024-12-04T15:05:50.486+00:00"],
            tags: ["shopping"],
            description: "this is the description of the itinerary",
            isActivated: true,
            ratings: [],
            picture: travellerBackground,
        },
        {
            language: "Arabic",
            location: "Cairo, Egypt",
            accessibility: ["Wheelchair", "Acc"],
            name: "Tour in GUC",
            price: 1000,
            availableDatesAndTimes: ["2024-12-04T15:05:50.486+00:00"],
            tags: ["shopping"],
            description: "this is the description of the itinerary",
            isActivated: true,
            ratings: [],
            picture: travellerBackground,
        },
        {
            language: "Arabic",
            location: "Cairo, Egypt",
            accessibility: ["Wheelchair, Acc"],
            name: "Tour in GUC",
            price: 1000,
            availableDatesAndTimes: ["2024-12-04T15:05:50.486+00:00"],
            tags: ["shopping"],
            description: "this is the description of the itinerary",
            isActivated: true,
            ratings: [],
            picture: travellerBackground,
        },
        {
            language: "Arabic",
            location: "Cairo, Egypt",
            accessibility: ["Wheelchair, Acc"],
            name: "Tour in GUC",
            price: 1000,
            availableDatesAndTimes: ["2024-12-04T15:05:50.486+00:00"],
            tags: ["shopping"],
            description: "this is the description of the itinerary",
            isActivated: true,
            ratings: [],
            picture: travellerBackground,
        },
        {
            language: "Arabic",
            location: "Cairo, Egypt",
            accessibility: ["Wheelchair, Acc"],
            name: "Tour in GUC",
            price: 1000,
            availableDatesAndTimes: ["2024-12-04T15:05:50.486+00:00"],
            tags: ["shopping"],
            description: "this is the description of the itinerary",
            isActivated: true,
            ratings: [],
            picture: travellerBackground,
        },
        {
            language: "Arabic",
            location: "Cairo, Egypt",
            accessibility: ["Wheelchair, Acc"],
            name: "Tour in GUC",
            price: 1000,
            availableDatesAndTimes: ["2024-12-04T15:05:50.486+00:00"],
            tags: ["shopping"],
            description: "this is the description of the itinerary",
            isActivated: true,
            ratings: [],
            picture: travellerBackground,
        },
    ]);
    const [searchedTerm, setSearchedTerm] = useState("");
    const [sortBy, setSortBy] = useState("Newest");

    const sortItineraries = (itineraries) => {
        console.log("Sort By", sortBy);
        let sortedItineraries = [...itineraries]; // Create a shallow copy
        if (sortBy === "Newest") {
            sortedItineraries.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        } else if (sortBy === "Oldest") {
            sortedItineraries.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
        }
        console.log("sortedItineraries", sortedItineraries);
        setitineraries(sortedItineraries);
    };

    const fetchData = async (query) => {
        const tourGuideID = Cookies.get("userId");
        try {
            const response = await axiosInstance.get(
                `/itinerary/getTourGuideItinerary/${tourGuideID}`,
                {
                    params: query,
                }
            );
            const data = response.data;
            sortItineraries(data);
            console.log("response sata is", data);
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
        sortItineraries(itineraries);
    }, [sortBy]);

    const deleteItineraryHandler = async (itineraryID) => {
        const response = await axiosInstance.delete(
            `/itinerary/deleteItinerary/${itineraryID}`
        );
        if (response.status === 200) {
            sortItineraries((prevItineraries) =>
                prevItineraries.filter((itinerary) => itinerary._id !== itineraryID)
            );
        } else {
            alert("Error deleting itinerary");
        }
    };

    return (
        <div>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: "9%",
                    zIndex: 1,
                }}
            >
                <NavBar />
            </div>

            <div>
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
                    My Itinenrary
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
                            placeholder="Search for an Itinenrary"
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
                        navigate("/create-itinerary");
                    }}
                >
                    <AddIcon sx={{ fontSize: "3vh" }} />
                    <p style={{ marginLeft: ".3vw" }}>Create Itinenrary</p>
                </Button>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: "-1vh",
                        minHeight: "50vh",
                    }}
                >
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
                        {itineraries.map((itinerary) => (
                            <div style={{ padding: "1.5vh" }}>
                                <CardItinerary
                                    itinerary={itinerary}
                                    width={"45vw"}
                                    height={"32vh"}
                                    setItineraries={setitineraries}
                                    firstLineButtons={[
                                        [
                                            <DeleteButton
                                                deleteItineraryHandler={
                                                    deleteItineraryHandler
                                                }
                                                itineraryID={itinerary._id}
                                            />,
                                        ],
                                    ]}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default MyItinenrary;
