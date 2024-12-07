import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import PaginationComponent from "../../components/Pagination";
import bookingsBackground from "../../assets/backgrounds/bookingsBackground.png";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import CardActivity from "../../components/CardActivity";
import CardItinerary from "../../components/CardItinerary";
import ShareAndMark from "../../components/ShareAndMark";
import { useNavigate } from "react-router-dom";
import FilterButtons from "../../components/FilterButtons";

const Bookmarks = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 4;
    const [selected, setSelected] = useState("Itineraries");
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);

    const buttons = ["Itineraries", "Activities"];

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleChooseType = (page) => {
        setSelected(page);
    };

    const URI = {
        Itineraries: "bookmark/getItineraryBookmarks",
        Activities: "bookmark/getActivityBookmarks",
    };

    const fetchBookmarks = async () => {
        try {
            const response = await axiosInstance.get(URI[selected], {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                },
                withCredentials: true,
            });
            console.log("data ", response);

            switch (selected) {
                case "Itineraries": {
                    setItineraries(response.data.result);
                    break;
                }
                case "Activities":
                    setActivities(response.data.result);
                    break;
            }
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch bookmarks", error);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, [currentPage]);

    useEffect(() => {
        fetchBookmarks();
        setCurrentPage(1);
    }, [selected]);

    const handleBookmark = async (bookmarkID, bookmarkType) => {
        try {
            const response = await axiosInstance.post(
                `bookmark/bookmark`,
                { bookmarkType, bookmarkID, isBookmarked: true },
                { withCredentials: true }
            );
            console.log("Bookmark response:", response.data);
            window.location.reload();
        } catch (error) {
            console.error("Error unbookmarking:", error);
        }
    };

    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            <div style={backgroundStyle}>
                <h1 style={headerStyle}>My Bookmarks</h1>
            </div>
            <div style={{ padding: "1% 0" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "1% 0",
                    }}
                >
                    <FilterButtons
                        buttons={buttons}
                        selected={selected}
                        handleChooseType={handleChooseType}
                    />
                </div>

                <div style={itemsContainerStyle}>
                    {/* <GenericCard width="40vw" height="20vw" /> */}
                    {selected == "Activities" && activities && (
                        <>
                            {activities.map((bookmark, index) => (
                                <div key={index} style={{ padding: "1.5vh" }}>
                                    <CardActivity
                                        activity={bookmark.bookmarkID}
                                        width={"46vw"}
                                        height={"34vh"}
                                        firstLineButtons={[
                                            <ShareAndMark
                                                width="1.2vw"
                                                height="1.2vw"
                                                styles={{ padding: "0.5vh" }}
                                                direction={`/activity-details/${bookmark.bookmarkID._id}`}
                                                isBookmarked={true}
                                                showBookmark={true}
                                                onSecondIconClick={() => {
                                                    handleBookmark(
                                                        bookmark.bookmarkID._id,
                                                        "Activity"
                                                    );
                                                }}
                                            />,
                                        ]}
                                        bottomButtons={[
                                            {
                                                text: "Book Now",
                                                onClick: () =>
                                                    navigate(
                                                        `/activity-details/${bookmark.bookmarkID._id}`
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
                        </>
                    )}
                    {selected == "Itineraries" && itineraries && (
                        <>
                            {itineraries.map((bookmark, index) => (
                                <div key={index} style={{ padding: "1.5vh" }}>
                                    <CardItinerary
                                        itinerary={bookmark.bookmarkID}
                                        width="46vw"
                                        height="34vh"
                                        firstLineButtons={[
                                            <ShareAndMark
                                                width="1.2vw"
                                                height="1.2vw"
                                                styles={{ padding: "0.5vh" }}
                                                id={bookmark.id}
                                                direction={`/itinerary-details/${bookmark.bookmarkID._id}`}
                                                isBookmarked={true}
                                                showBookmark={true}
                                                onSecondIconClick={() => {
                                                    handleBookmark(
                                                        bookmark.bookmarkID._id,
                                                        "Itinerary"
                                                    );
                                                }}
                                            />,
                                        ]}
                                        bottomButtons={[
                                            {
                                                text: "Book Now",
                                                onClick: () =>
                                                    navigate(
                                                        `/itinerary-details/${bookmark.bookmarkID._id}`
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
                        </>
                    )}
                </div>
                <PaginationComponent
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onChange={handlePageChange}
                />
            </div>
            <Footer />
        </div>
    );
};

const backgroundStyle = {
    width: "100vw",
    height: "30vh",
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bookingsBackground})`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    shadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const headerStyle = {
    position: "relative",
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "5%",
    color: "White",
};

const buttonGroupStyle = {
    display: "flex",
    gap: "10px",
    marginLeft: "2%",
};

const buttonStyle = {
    padding: "10px 20px",
    border: "2px solid #000",
    borderRadius: "20px",
    backgroundColor: "transparent",
    color: "#000",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease",
};

const selectedButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#FF5722",
    color: "#fff",
};

const filterButtonsGroupStyle = {
    marginLeft: "8.5vw",
    display: "flex",
    justifyContent: "center",
};

const itemsContainerStyle = {
    paddingTop: "2vh",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
};

export default Bookmarks;
