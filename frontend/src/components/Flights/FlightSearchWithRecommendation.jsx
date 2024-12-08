import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "../Hotels/SearchWithRecommendation.css";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

const FlightSearchWithRecommendation = ({
    query,
    setQuery,
    chosenCity,
    setChosenCity,
    message,
}) => {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query) fetchSuggestions(query);
        }, 100);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);
    useEffect(() => {
        if (chosenCity) {
            setQuery(
                chosenCity.name +
                    " (" +
                    chosenCity.iataCode +
                    "), " +
                    chosenCity.address.countryCode
            );
        }
    }, [chosenCity]);
    const handleQueryChange = (newValue) => {
        setQuery(newValue);
        setChosenCity(null);
    };

    const fetchSuggestions = async () => {
        const city = query.split(",")[0];
        try {
            const response = await axiosInstance.get(
                `/amadeus/flights/airport-search?keyword=${city}`
            );
            // Check if the response is JSON
            setSuggestions(response.data); // Store the suggestions from the backend
        } catch (error) {
            console.error("Error fetching suggestions:", error.message);
        }
    };
    return (
        <div style={searchContainer}>
            <AiOutlineSearch className="search-icon" />
            <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder={message}
                className="search-input"
            />
            {query && (
                <AiOutlineClose
                    className="clear-icon"
                    onClick={() => handleQueryChange("")}
                />
            )}

            {query && !chosenCity && (
                <div className="dropdown-search">
                    {suggestions
                        .filter((item) =>
                            item.name.toLowerCase().includes(query.toLowerCase())
                        )
                        .map((suggestion, index) => (
                            <div
                                key={index}
                                className="dropdown-search-item"
                                onClick={() => setChosenCity(suggestion)}
                            >
                                {suggestion.name}
                                {" (" +
                                    suggestion.iataCode +
                                    "), " +
                                    suggestion.address.countryCode}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

const searchContainer = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "8px 16px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "80%",
};

export default FlightSearchWithRecommendation;
