import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "react-datetime/css/react-datetime.css";
import SideBar from "../../components/SideBar/SideBar";
import SearchField from "../../components/SearchField/SearchField";
import Sorter from "../../components/Sorter";
import PriceRange from "../../components/PriceRange";
import CheckboxList from "../../components/CheckBoxList";
import itineraryBackground from "../../assets/images/Itinerariesbackground.png";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import CardItinerary from "../../components/CardItinerary";
import ShareAndMark from "../../components/ShareAndMark";
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../../hooks/currencyHooks.js";

const Itineraries = () => {
    const [userType, setUserType] = useState("Guest");
    const currency = Cookies.get("currency") || "EGP";
    const { isLoading, convertPrice } = useCurrencyConverter(currency);
    const minPrice = convertPrice(0, "EGP", currency);
    const maxPrice = convertPrice(2000, "EGP", currency); // TODO: select better bounds

    const [itineraries, setItineraries] = useState([]);
    const [bookmarkStatus, setBookmarkStatus] = useState({});
    const [tags, setTags] = useState([""]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
    const [sortBy, setSortBy] = useState("priceAsc");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cookieUserType = Cookies.get("userType") || "Guest";
        console.log("User type from cookie:", cookieUserType);
        if (cookieUserType && cookieUserType !== "undefined") {
            setUserType(cookieUserType);
        }
    }, []);

    const fetchTags = async () => {
        try {
            const response = await axiosInstance.get(`/tag/allTags/`);
            let tags = [];
            for (let tag of response.data) {
                tags.push(tag._id);
            }
            setTags(tags);
        } catch (error) {
            console.error("Error fetching Tags:", error);
        }
    };

    const sortItineraries = (itineraries) => {
        let sortItineraries = [...itineraries]; // Create a shallow copy
        if (sortBy === "priceAsc") {
            sortItineraries.sort((a, b) => a.price - b.price);
        } else if (sortBy === "priceDesc") {
            sortItineraries.sort((a, b) => b.price - a.price);
        } else if (sortBy === "ratingAsc") {
            sortItineraries.sort((a, b) => a.rating - b.rating);
        } else if (sortBy === "ratingDesc") {
            sortItineraries.sort((a, b) => b.rating - a.rating);
        }
        console.log("sortedItineraries", sortItineraries);
        setItineraries(sortItineraries);
    };

    const fetchItineraries = async (query) => {
        try {
            console.log("query", query);
            const response = await axiosInstance.get(
                `/itinerary/getUpcomingItineraries/`,
                {
                    params: query,
                }
            );
            console.log("response", response.data);
            sortItineraries(response.data);
        } catch (error) {
            console.error("Error fetching Activities:", error);
        }
    };

    const fetchBookmarkedStatus = async (query) => {
        if (userType !== "Tourist") return;

        const itineraryIDs = itineraries.map((itinerary) => {
            return itinerary._id;
        });
        try {
            const response = await axiosInstance.post(
                `/tourist/getBookmarkStatus/`,
                {
                    bookmarkIDs: itineraryIDs,
                },
                { withCredentials: true }
            );
            console.log("bookmarked status", response.data);
            setBookmarkStatus(response.data);
        } catch (error) {
            console.error("Error fetching bookmark status:", error);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        const query = buildQuery();
        fetchItineraries(query);
    }, [priceRange, name, location]);

    useEffect(() => {
        sortItineraries(itineraries);
    }, [sortBy]);

    useEffect(() => {
        fetchBookmarkedStatus();
    }, [itineraries]);

    const buildQuery = () => {
        let query = {};

        if (selectedTags && selectedTags.length > 0) {
            query.tags = selectedTags.join("|");
            console.log(query.tags);
        } else {
            delete query.tags;
        }

        if (priceRange[0] || priceRange[1]) {
            query.price =
                convertPrice(priceRange[0], currency, "EGP") +
                "-" +
                convertPrice(priceRange[1], currency, "EGP");
        } else {
            delete query.price;
        }

        if (name) {
            query.name = "~" + name;
        } else {
            delete query.name;
        }

        if (location) {
            query.location = "~" + location;
        } else {
            delete query.location;
        }

        return query;
    };

    const handleBookmark = async (itineraryID) => {
        try {
            const response = await axiosInstance.post(
                `tourist/bookmark`,
                {
                    bookmarkType: "Itinerary",
                    bookmarkID: itineraryID,
                    isBookmarked: bookmarkStatus[itineraryID],
                },
                { withCredentials: true }
            );
            console.log("Bookmark response:", response.data);
            const oldStatus = bookmarkStatus[itineraryID];
            setBookmarkStatus((prevStatus) => {
                prevStatus[itineraryID] = !oldStatus;
                console.log(prevStatus);
                return { ...prevStatus };
            });
        } catch (error) {
            console.error("Error bookmarking itinerary:", error);
        }
    };

    const nonCollapsibleItems = [
        <SearchField
            placeholder="Search by name"
            searchText={name}
            setSearchText={setName}
        />,
    ];
    const titles = ["Sort By", "Locations", "Price Range", "Tags"];
    const collapsibleItems = [
        <Sorter
            values={["priceAsc", "priceDesc", "ratingAsc", "ratingDesc"]}
            labels={[
                "Price (Low to High)",
                "Price (High to Low)",
                "Rating (Low to High)",
                "Rating (How to High)",
            ]}
            value={sortBy}
            setValue={setSortBy}
        />,
        <SearchField
            placeholder="Search by location"
            searchText={location}
            setSearchText={setLocation}
        />,
        <PriceRange
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            min={minPrice}
            max={maxPrice}
        />,
        <CheckboxList
            items={tags}
            checkedItems={selectedTags}
            setCheckedItems={setSelectedTags}
        />,
    ];

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            <div
                style={{
                    width: "100vw",
                    height: "30vh",
                    backgroundImage: `url(${itineraryBackground})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "1%",
                    marginTop: "1%",
                    marginBottom: "1%",
                }}
            >
                <div
                    style={{
                        width: "35vw",
                        borderRadius: "3vh",
                    }}
                >
                    <SideBar
                        collapsibleItems={collapsibleItems}
                        nonCollapsibleItems={nonCollapsibleItems}
                        titles={titles}
                    />
                </div>
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
                    Itineraries
                </div>
                <div style={{ width: "75vw" }}>
                    {itineraries.map((itinerary, index) => (
                        <div key={index} style={{ padding: "1.5vh" }}>
                            <CardItinerary
                                itinerary={itinerary}
                                width="60vw"
                                height="32vh"
                                firstLineButtons={[
                                    <ShareAndMark
                                        width="1.2vw"
                                        height="1.2vw"
                                        styles={{ padding: "0.5vh" }}
                                        id={itinerary.id}
                                        direction={`/itinerary-details/${itinerary.id}`}
                                        isBookmarked={bookmarkStatus[itinerary.id]}
                                        showBookmark={userType === "Tourist"}
                                        onSecondIconClick={() =>
                                            handleBookmark(itinerary.id)
                                        }
                                    />,
                                ]}
                                bottomButtons={[
                                    {
                                        text: "Book Now",
                                        onClick: () =>
                                            navigate(
                                                `/itinerary-details/${itinerary.id}`
                                            ),
                                        type: "1",
                                        width: "70%",
                                    },
                                ]}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Itineraries;
