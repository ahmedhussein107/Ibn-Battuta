import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "react-datetime/css/react-datetime.css";
import SideBar from "../../components/SideBar/SideBar";
import SearchField from "../../components/SearchField/SearchField";
import CheckboxList from "../../components/CheckBoxList";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import landmarkbackground from "../../assets/backgrounds/landmarksBackground.png";
const minPrice = 0;
const maxPrice = 1000;

const Landmarks = () => {
    const [landmarks, setLandmarks] = useState([]);
    const [tags, setTags] = useState([""]);
    const [categories, setCategories] = useState([""]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [name, setName] = useState("");
    const [searchedTag, setSearchedTag] = useState("");
    const [searchedCategory, setSearchedCategory] = useState("");
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

    const fetchLandmarks = async (query) => {
        try {
            console.log("query", query);
            const response = await axiosInstance.get(`/landmark/allLandmarks/`, {
                params: query,
            });
            console.log("response", response.data);
            setLandmarks(response.data);
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
        fetchLandmarks(query);
    }, [searchedTag, searchedCategory, selectedTags, selectedCategories, name, location]);

    const buildQuery = () => {
        let query = {};

        if (searchedTag) {
            query.tags = searchedTag;
        } else {
            if (selectedTags && selectedTags.length > 0) {
                query.tags = selectedTags.join("|");
            } else {
                delete query.tags;
            }
        }

        if (searchedCategory) {
            query.category = searchedCategory;
        } else {
            if (selectedCategories && selectedCategories.length > 0) {
                query.category = selectedCategories.join("|");
            } else {
                delete query.category;
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
        <SearchField
            placeholder="Search by Category"
            searchText={searchedCategory}
            setSearchText={setSearchedCategory}
        />,
    ];
    const titles = ["Locations", "Tags", "Category"];
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
        <CheckboxList
            items={categories}
            checkedItems={selectedCategories}
            setCheckedItems={setSelectedCategories}
        />,
    ];
    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            <div style={{ position: "fixed", top: 0, left: "9%" }}>
                <NavBar />
            </div>
            <div
                style={{
                    width: "100vw",
                    height: "30vh",
                    backgroundImage: `url(${landmarkbackground})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>

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
                        width: "28vw",
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
                    LandMarks
                </div>
                {/* <div style={{ width: "75vw" }}>
                    {activities.map((activity) => {
                        return (
                            <ActivityCard activity={activity} handleDelete={() => {}} />
                        );
                    })}
                </div> */}
            </div>
            <Footer />
        </div>
    );
};

export default Landmarks;
