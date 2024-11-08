import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./SearchWithRecommendation.css";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

const SearchWithRecommendation = ({ query, setQuery, chosenCity, setChosenCity }) => {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query) fetchSuggestions(query);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);
    useEffect(() => {
        if (chosenCity) {
            setQuery(chosenCity.name + ", " + chosenCity.address.countryCode);
        }
    }, [chosenCity]);
    const handleClear = () => {
        setQuery("");
        setChosenCity(null);
    };

    const fetchSuggestions = async () => {
        try {
            const response = await axiosInstance.get("amadeus/hotels/search/city", {
                params: { cityName: query },
            });
            setSuggestions(response.data);
            console.log("suggestions are", suggestions);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };
    return (
        <div className="search-container">
            <AiOutlineSearch className="search-icon" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="search-input"
            />
            {query && <AiOutlineClose className="clear-icon" onClick={handleClear} />}

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
                                {suggestion.name},{" " + suggestion.address.countryCode}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default SearchWithRecommendation;
