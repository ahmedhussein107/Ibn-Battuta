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
import ItineraryCard from "../../components/ItineraryCard";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const MyItinenrary = () => {
    const navigate = useNavigate();

    const [itineraries, setitineraries] = useState([]);
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
                            value={searchedTerm}
                            onChange={(e) => setSearchedTerm(e.target.value)}
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
                        marginTop: "5vh",
                        marginLeft: "2.5vh",
                        borderRadius: "4vh",
                        minWidth: "15vh",
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
                        marginTop: "5vh",
                        marginLeft: "3vh",
                        borderRadius: "4vh",
                        minWidth: "15vh",
                        color: "black",
                        borderColor: "black",
                        maxHeight: "4vh",
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
                        gap: "4vh",
                        padding: "3vh",
                        marginTop: "-1vh",
                    }}
                >
                    {itineraries.map((itinerary, index) => (
                        <div key={index} style={{ flex: "1 2 calc(50% - 2vh)" }}>
                            <ItineraryCard
                                itinerary={itinerary}
                                handleDelete={async () => {
                                    await axiosInstance.delete(
                                        `/itinerary/deleteItinerary/${itinerary._id}`
                                    );
                                    window.location.reload();
                                }}
                            />
                        </div>
                    ))}
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default MyItinenrary;
