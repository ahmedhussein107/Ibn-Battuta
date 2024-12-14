import React, { useEffect, useState } from "react";
import i2 from "../../assets/images/i2.png";
import i1 from "../../assets/backgrounds/itineraries.png";
import NavBar from "../../components/NavBar";
import { Avatar, Button } from "@mui/material";
import { orange } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";
import Footer from "../../components/Footer";
import SwapVert from "@mui/icons-material/SwapVert";
import axiosInstance from "../../api/axiosInstance";
import FlagIcon from "@mui/icons-material/Flag";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import { useNavigate } from "react-router-dom";
import CardItinerary from "../../components/CardItinerary";
import travellerBackground from "../../assets/backgrounds/travellerBackground.png";

const AllItineraries = () => {
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
        try {
            const response = await axiosInstance.get(`/itinerary/getAllItineraries`, {
                params: query,
            });
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

    const flagItineraryHandler = async (itinerary, index) => {
        try {
            const response = await axiosInstance.patch(
                `/itinerary/toggleFlag/${itinerary._id}`
            );
            console.log(response.data);
            setitineraries((itineraries) => {
                const newItineraries = [...itineraries];
                newItineraries[index] = { ...itinerary, isFlagged: !itinerary.isFlagged };
                return newItineraries;
            });
        } catch (error) {
            console.log(error);
            alert("Error flagging itinerary");
        }
    };

    return (
        <div style={{ position: "absolute", left: 0, top: 0 }}>
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
                {/* <img
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
                /> */}

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
                    All Itinenraries
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
                                bgcolor: "#9C4F21",
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
                    {itineraries.map((itinerary, index) => (
                        <div style={{ padding: "1.5vh" }}>
                            <CardItinerary
                                itinerary={itinerary}
                                width={"45vw"}
                                height={"32vh"}
                                setItineraries={sortItineraries}
                                firstLineButtons={[
                                    [
                                        itinerary.isFlagged ? (
                                            <FlagIcon
                                                style={{
                                                    color: "red",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    flagItineraryHandler(itinerary, index)
                                                }
                                            />
                                        ) : (
                                            <OutlinedFlagIcon
                                                style={{
                                                    color: "gray",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    flagItineraryHandler(itinerary, index)
                                                }
                                            />
                                        ),
                                    ],
                                ]}
                                bottomButtons={[
                                    {
                                        text: "View Details",
                                        onClick: () =>
                                            navigate(
                                                `/itinerary-details/${itinerary.id}`
                                            ),
                                        type: "always-dark",
                                        width: "70%",
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

export default AllItineraries;
