import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "react-datetime/css/react-datetime.css";
import SideBar from "../../components/SideBar/SideBar";
import SearchField from "../../components/SearchField/SearchField";
import Sorter from "../../components/Sorter";
import PriceRange from "../../components/PriceRange";
import CheckboxList from "../../components/CheckBoxList";

const minPrice = 0;
const maxPrice = 1000;

const Itineraries = () => {
    const [itineraries, setItineraries] = useState([]);
    const [tags, setTags] = useState([""]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
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

    const buildQuery = () => {
        let query = {};

        if (selectedTags && selectedTags.length > 0) {
            query.tags = selectedTags.join("|");
        } else {
            delete query.tags;
        }

        if (priceRange[0] || priceRange[1]) {
            query.price = priceRange[0] + "-" + priceRange[1];
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
    return (
        <SideBar
            collapsibleItems={collapsibleItems}
            nonCollapsibleItems={nonCollapsibleItems}
            titles={titles}
        />
    );
};

export default Itineraries;
