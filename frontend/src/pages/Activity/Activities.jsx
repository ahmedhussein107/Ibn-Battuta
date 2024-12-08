import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "react-datetime/css/react-datetime.css";
import SideBar from "../../components/SideBar/SideBar";
import SearchField from "../../components/SearchField/SearchField";
import Sorter from "../../components/Sorter";
import PriceRange from "../../components/PriceRange";
import RatingRange from "../../components/RatingRange";
// import DatePicker from "../../components/DatePicker";
import CheckboxList from "../../components/CheckBoxList";
import Footer from "../../components/Footer";
import activitiesBackground from "../../assets/backgrounds/activities.png";
import CardActivity from "../../components/CardActivity";
import ShareAndMark from "../../components/ShareAndMark";
import PaginationComponent from "../../components/Pagination.jsx";
import { useNavigate } from "react-router-dom";
import { useCurrencyConverter } from "../../hooks/currencyHooks.js";
import { CircularProgress } from "@mui/material";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import Cookies from "js-cookie";

const Activities = () => {
    const [userType, setUserType] = useState("Guest");
    const currency = Cookies.get("currency") || "EGP";
    const { convertPrice, isLoading } = useCurrencyConverter();

    const minPrice = convertPrice(0, "EGP", currency);
    const maxPrice = convertPrice(1000000000, "EGP", currency);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    const [activities, setActivities] = useState([]);
    const [bookmarkStatus, setBookmarkStatus] = useState({});
    const [tags, setTags] = useState([""]);
    const [categories, setCategories] = useState([""]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
    const [ratingRange, setRatingRange] = useState([null, 5]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
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

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(
                `/category/allCategories/`
            );
            let categs = [];
            for (let category of response.data) {
                categs.push(category._id);
            }
            setCategories(categs);
        } catch (error) {
            console.error("Error fetching Categories:", error);
        }
    };

    const fetchBookmarkedStatus = async (query) => {
        if (userType !== "Tourist") return;

        const activityIDs = activities.map((activity) => {
            return activity._id;
        });
        try {
            const response = await axiosInstance.post(
                `/bookmark/getBookmarkStatus/`,
                {
                    bookmarkIDs: activityIDs,
                },
                { withCredentials: true }
            );
            console.log("bookmarked status", response.data);
            setBookmarkStatus(response.data);
        } catch (error) {
            console.error("Error fetching bookmark status:", error);
        }
    };

    const fetchActivities = async (query) => {
        try {
            console.log("query", query);
            const response = await axiosInstance.get(
                `/activity/getUpcomingActivities/`,
                {
                    params: {
                        ...query,
                        page: currentPage,
                        limit: itemsPerPage,
                        sortBy,
                    },
                }
            );
            setActivities(response.data.result);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching Activities:", error);
        }
    };

    useEffect(() => {
        fetchTags();
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchBookmarkedStatus();
    }, [activities]);

    useEffect(() => {
        const query = buildQuery();
        setCurrentPage(1);
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
        sortBy,
    ]);

    useEffect(() => {
        const query = buildQuery();
        fetchActivities(query);
    }, [currentPage]);

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
            query.price =
                convertPrice(priceRange[0], currency, "EGP") +
                "-" +
                convertPrice(priceRange[1], currency, "EGP");
        } else {
            delete query.price;
        }

        if (ratingRange[0] || ratingRange[1]) {
            if (!ratingRange[0]) {
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

    const handleBookmark = async (activityID) => {
        try {
            const response = await axiosInstance.post(
                `bookmark/bookmark`,
                {
                    bookmarkType: "Activity",
                    bookmarkID: activityID,
                    isBookmarked: bookmarkStatus[activityID],
                },
                { withCredentials: true }
            );
            console.log("Bookmark response:", response.data);
            const oldStatus = bookmarkStatus[activityID];
            setBookmarkStatus((prevStatus) => {
                prevStatus[activityID] = !oldStatus;
                console.log(prevStatus);
                return { ...prevStatus };
            });
        } catch (error) {
            console.error("Error bookmarking activity:", error);
        }
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
        <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />,
        <RatingRange
            ratingRange={ratingRange}
            setRatingRange={setRatingRange}
        />,
        <RangePicker
            onChange={(_, dateStrings) => {
                setStartDate(dateStrings[0]);
                setEndDate(dateStrings[1]);
            }}
        />,
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

    if (isLoading) {
        // TODO: add better loading animation
        return <CircularProgress />;
    }

    return (
        <div
            style={{
                width: "100vw",
                position: "absolute",
                top: "0",
                left: "0",
            }}
        >
            <div
                style={{
                    width: "100vw",
                    height: "30vh",
                    color: "#FAE2B6",
                    backgroundImage: `url(${activitiesBackground})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                <div style={{ marginBottom: "2%" }}>
                    <p
                        style={{
                            fontSize: "2.5rem",
                            marginBottom: "1rem",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                            color: "white",
                            fontWeight: "bold",
                            userSelect: "none",
                        }}
                    >
                        Activities
                    </p>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "2%",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        width: "30%",
                        borderRadius: "3vh",
                        marginTop: "1%",
                        marginBottom: "1%",
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
                        minHeight: "50vh",
                        width: "65%",
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    {activities.map((activity, index) => (
                        <div key={index} style={{ padding: "1.5vh" }}>
                            <CardActivity
                                activity={activity}
                                width={"90%"}
                                height={"34vh"}
                                firstLineButtons={[
                                    <ShareAndMark
                                        width="1.2vw"
                                        height="1.2vw"
                                        styles={{ padding: "0.5vh" }}
                                        direction={`/activity-details/${activity.id}`}
                                        isBookmarked={
                                            bookmarkStatus[activity.id]
                                        }
                                        showBookmark={userType === "Tourist"}
                                        onSecondIconClick={() =>
                                            handleBookmark(activity.id)
                                        }
                                    />,
                                ]}
                                bottomButtons={[
                                    {
                                        text:
                                            userType !== "Tourist" &&
                                            userType !== "Guest"
                                                ? "View Details"
                                                : "Book Now",

                                        onClick: () =>
                                            navigate(
                                                `/activity-details/${activity.id}`
                                            ),
                                        type: "always-dark",
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
            </div>
            <div style={{ paddingBottom: "1%" }}>
                <PaginationComponent
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onChange={(event, newPage) => {
                        setCurrentPage(newPage);
                    }}
                />
            </div>
            <Footer />
        </div>
    );
};

export default Activities;
