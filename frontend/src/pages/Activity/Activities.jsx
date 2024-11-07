import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "react-datetime/css/react-datetime.css";
import SideBar from "../../components/SideBar/SideBar";
import SearchField from "../../components/SearchField/SearchField";
import Sorter from "../../components/Sorter";
import PriceRange from "../../components/PriceRange";
import RatingRange from "../../components/RatingRange";
import DatePicker from "../../components/DatePicker";
import CheckboxList from "../../components/CheckBoxList";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import ActivityCard from "../../components/ActivityCard";
import activitiesBackground from "../../assets/backgrounds/activitiesBackground.png";
import CardActivity from "../../components/CardActivity";
import ShareAndMark from "../../components/ShareAndMark";

const minPrice = 0;
const maxPrice = 1000;

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [tags, setTags] = useState([""]);
    const [categories, setCategories] = useState([""]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
    const [ratingRange, setRatingRange] = useState([1, 5]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortBy, setSortBy] = useState("priceAsc");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

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

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(`/category/allCategories/`);
            let categs = [];
            for (let category of response.data) {
                categs.push(category._id);
            }
            setCategories(categs);
        } catch (error) {
            console.error("Error fetching Categories:", error);
        }
    };

    const sortActivities = (activities) => {
        let sortedActivities = [...activities]; // Create a shallow copy
        if (sortBy === "priceAsc") {
            sortedActivities.sort((a, b) => a.price - b.price);
        } else if (sortBy === "priceDesc") {
            sortedActivities.sort((a, b) => b.price - a.price);
        } else if (sortBy === "ratingAsc") {
            sortedActivities.sort((a, b) => a.rating - b.rating);
        } else if (sortBy === "ratingDesc") {
            sortedActivities.sort((a, b) => b.rating - a.rating);
        }
        console.log("sortedActivities", sortedActivities);
        setActivities(sortedActivities);
    };

    const fetchActivities = async (query) => {
        try {
            console.log("query", query);
            const response = await axiosInstance.get(`/activity/getUpcomingActivities/`, {
                params: query,
            });
            console.log("response", response.data);
            sortActivities(response.data);
        } catch (error) {
            console.error("Error fetching Activities:", error);
        }
    };

    useEffect(() => {
        fetchTags();
        fetchCategories();
    }, []);

    useEffect(() => {
        const query = buildQuery();
        fetchActivities(query);
    }, [
        selectedTags,
        selectedCategories,
        priceRange,
        ratingRange,
        startDate,
        endDate,
        name,
        location,
    ]);

    useEffect(() => {
        sortActivities(activities);
    }, [sortBy]);

    const buildQuery = () => {
        let query = {};

        if (selectedTags && selectedTags.length > 0) {
            query.tags = selectedTags.join("|");
        } else {
            delete query.tags;
        }

        if (selectedCategories && selectedCategories.length > 0) {
            query.category = selectedCategories.join("|");
        } else {
            delete query.category;
        }

        if (priceRange[0] || priceRange[1]) {
            query.price = priceRange[0] + "-" + priceRange[1];
        } else {
            delete query.price;
        }

        if (ratingRange[0] || ratingRange[1]) {
            if (ratingRange[0] === 1) {
                query.rating = "-" + ratingRange[1];
            } else {
                query.rating = ratingRange[0] + "-" + ratingRange[1];
            }
        } else {
            delete query.rating;
        }

        if (startDate || endDate) {
            query.startDate = startDate + "€" + endDate;
        } else {
            delete query.startDate;
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

    const nonCollapsibleItems = [
        <SearchField
            placeholder="Search by name"
            searchText={name}
            setSearchText={setName}
        />,
    ];
    const titles = [
        "Sort By",
        "Locations",
        "Price Range",
        "Rating Range",
        "Date Range",
        "Tags",
        "Category",
    ];
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
        <RatingRange ratingRange={ratingRange} setRatingRange={setRatingRange} />,
        <div style={{ display: "flex", flexDirection: "column" }}>
            <DatePicker label="Start Date" setValue={setStartDate} />
            <DatePicker label="End Date" setValue={setEndDate} />
        </div>,
        <CheckboxList
            items={tags}
            checkedItems={selectedTags}
            setCheckedItems={setSelectedTags}
        />,
        <CheckboxList
            items={categories}
            checkedItems={selectedCategories}
            setCheckedItems={setSelectedCategories}
        />,
    ];
    return (
        <div style={{ width: "100vw" }}>
            <div
                style={{
                    width: "100vw",
                    height: "35vh",
                    backgroundImage: `url(${activitiesBackground})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>
            <div style={{ position: "fixed", top: 0, left: "9%" }}>
                <NavBar />
            </div>
            <div style={{ display: "flex", flexDirection: "row", marginLeft: "2%" }}>
                <div
                    style={{
                        width: "25vw",
                        boxShadow: "0 5vh 5vh rgba(0, 0, 0, 0.1)",
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
                        marginTop: "1%",
                        minHeight: "50vh",
                        minWidth: "100vw",
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        justifyContent: "space-evenly",
                        marginLeft: "5%",
                    }}
                >
                    {activities.map((activity) => (
                        <div style={{ padding: "1.5vh" }}>
                            <CardActivity
                                activity={activity}
                                width={"60vw"}
                                height={"37vh"}
                                firstLineButtons={[
                                    <ShareAndMark
                                        width="1.5vw"
                                        height="1.5vw"
                                        styles={{ padding: "0.5vh" }}
                                    />,
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

export default Activities;
