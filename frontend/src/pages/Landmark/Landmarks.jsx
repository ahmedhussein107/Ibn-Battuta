import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "react-datetime/css/react-datetime.css";
import SideBar from "../../components/SideBar/SideBar";
import SearchField from "../../components/SearchField/SearchField";
import CheckboxList from "../../components/CheckBoxList";
import PaginationComponent from "../../components/Pagination";
import Footer from "../../components/Footer";
import landmarkbackground from "../../assets/backgrounds/landmarksBackground.png";
import CardLandmark from "../../components/CardLandmark";
import ShareAndMark from "../../components/ShareAndMark";

const Landmarks = () => {
    const [landmarks, setLandmarks] = useState([]);
    const [tags, setTags] = useState([""]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [name, setName] = useState("");
    const [searchedTag, setSearchedTag] = useState("");
    const [location, setLocation] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    const fetchTags = async () => {
        try {
            const response = await axiosInstance.get(`/landmarkTag/allLandmarkTags/`);
            let tags = [];
            for (let tag of response.data) {
                tags.push(tag._id);
            }
            setTags(tags);
        } catch (error) {
            console.error("Error fetching Tags:", error);
        }
    };

    const fetchLandmarks = async (query) => {
        try {
            console.log("query", query);
            const response = await axiosInstance.get(`/landmark/allLandmarks/`, {
                params: {
                    ...query,
                    page: currentPage,
                    limit: itemsPerPage,
                },
            });
            console.log("response", response.data);
            setTotalPages(response.data.totalPages);
            setLandmarks(response.data.result);
        } catch (error) {
            console.error("Error fetching landmarks:", error);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        const query = buildQuery();
        setCurrentPage(1);
        fetchLandmarks(query);
    }, [searchedTag, selectedTags, name, location]);

    useEffect(() => {
        const query = buildQuery();
        fetchLandmarks(query);
    }, [currentPage]);

    const buildQuery = () => {
        let query = {};

        if (searchedTag) {
            query.tags = "~" + searchedTag;
        } else {
            if (selectedTags && selectedTags.length > 0) {
                query.tags = selectedTags.join("|");
            } else {
                delete query.tags;
            }
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
            placeholder="Search by Name"
            searchText={name}
            setSearchText={setName}
        />,
        <SearchField
            placeholder="Search by Tag"
            searchText={searchedTag}
            setSearchText={setSearchedTag}
        />,
    ];
    const titles = ["Locations", "Tags"];
    const collapsibleItems = [
        <SearchField
            placeholder="Search by location"
            searchText={location}
            setSearchText={setLocation}
        />,
        <CheckboxList
            items={tags}
            checkedItems={selectedTags}
            setCheckedItems={setSelectedTags}
        />,
    ];
    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            <div
                style={{
                    width: "100vw",
                    height: "35vh",
                    color: "#FAE2B6",
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${landmarkbackground})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                <div style={{ marginLeft: "5%", marginBottom: "2%" }}>
                    <p
                        style={{
                            fontSize: "2.5rem",
                            marginBottom: "1rem",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                            color: "white",
                            fontWeight: "500",
                            userSelect: "none",
                        }}
                    >
                        Landmarks
                    </p>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "2%",
                    marginTop: "1%",
                    marginBottom: "1%",
                }}
            >
                <div
                    style={{
                        width: "30vw",
                        borderRadius: "3vh",
                    }}
                >
                    <SideBar
                        collapsibleItems={collapsibleItems}
                        nonCollapsibleItems={nonCollapsibleItems}
                        titles={titles}
                    />
                </div>
                <div style={{ width: "70vw" }}>
                    {landmarks.map((landmark) => {
                        return (
                            <div style={{ marginBottom: "3vh" }}>
                                <CardLandmark
                                    landmark={landmark}
                                    width={"60vw"}
                                    height={"40vh"}
                                    firstLineButtons={[
                                        <ShareAndMark
                                            width="1.2vw"
                                            height="1.2vw"
                                            styles={{ padding: "0.5vh" }}
                                            id={landmark.id}
                                        />,
                                    ]}
                                />
                            </div>
                        );
                    })}
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

export default Landmarks;
