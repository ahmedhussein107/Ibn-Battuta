import Button from "../../components/Button";
import { useState } from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import FlightSearchWithRecommendation from "./FlightSearchWithRecommendation";

const FlightSearchFields = ({
    keyword,
    setKeyword,
    keyword2,
    setKeyword2,
    startDate,
    setStartDate,
    returnDate,
    setReturnDate,
    departureAirport,
    setDepartureAirport,
    arrivalAirport,
    setArrivalAirport,
    adults,
    setAdults,
    children,
    setChildren,
    handleSearch,
    isLoading,
    error,
}) => {
    const [suggestions, setSuggestions] = useState([]); // Search suggestions
    const [suggestions2, setSuggestions2] = useState([]); // Search suggestions
    const fetchSuggestions = async (keyword) => {
        if (keyword.length >= 3) {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/amadeus/flights/airport-search?keyword=${keyword}`
                );
                // Check if the response is JSON
                const contentType = response.headers.get("Content-Type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Expected JSON response");
                }
                const data = await response.json();
                setSuggestions(data); // Store the suggestions from the backend
            } catch (error) {
                console.error("Error fetching suggestions:", error.message);
            }
        } else {
            setSuggestions([]); // Clear suggestions if no keyword
        }
    };

    // Handle input change and fetch new suggestions
    const handleInputChange = (e) => {
        const value = e.target.value;
        setKeyword(value); // Update the keyword state
        fetchSuggestions(value); // Fetch suggestions based on input
    };

    // Function to fetch suggestions from the backend for the second input field
    const fetchSuggestions2 = async (keyword2) => {
        if (keyword2.length >= 3) {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/amadeus/flights/airport-search?keyword=${keyword2}`
                );
                // Check if the response is JSON
                const contentType = response.headers.get("Content-Type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Expected JSON response");
                }
                const data = await response.json();
                setSuggestions2(data); // Store the suggestions from the backend
            } catch (error) {
                console.error("Error fetching suggestions:", error.message);
            }
        } else {
            setSuggestions2([]); // Clear suggestions if no keyword
        }
    };

    // Handle input change and fetch new suggestions for the second input field
    const handleInputChange2 = (e) => {
        const value = e.target.value;
        setKeyword2(value); // Update the keyword state
        fetchSuggestions2(value); // Fetch suggestions based on input
    };

    const handleRangeChange = (_, dateStrings) => {
        setStartDate(dateStrings[0]);
        setReturnDate(dateStrings[1]);
    };

    return (
        <div>
            <div
                style={{
                    width: "90%",
                    height: "15vh",
                    backgroundColor: "#ECD1B4",
                    margin: "0 auto",
                    padding: "2vh",
                    borderRadius: "1vw",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* First Small Rectangle with "From" Label and Search Field */}
                <div style={flightPageSearch}>
                    <FlightSearchWithRecommendation
                        query={keyword}
                        setQuery={setKeyword}
                        chosenCity={departureAirport}
                        setChosenCity={setDepartureAirport}
                        message="From (city or airport)"
                    />
                </div>

                {/* Second Small Rectangle with "To" Label */}
                <div className="hotels-controls-search">
                    <FlightSearchWithRecommendation
                        query={keyword2}
                        setQuery={setKeyword2}
                        chosenCity={arrivalAirport}
                        setChosenCity={setArrivalAirport}
                        message="To (city or airport)"
                    />
                </div>

                {/* third Small Rectangle */}
                <div className="hotels-controls-date">
                    <RangePicker onChange={handleRangeChange} />
                </div>

                {/* fourth Small Rectangle */}

                {/* fifth Small Rectangle */}
                <div
                    style={{
                        width: "12vw",
                        height: "11vh",
                        backgroundColor: "white",
                        marginRight: "1.5vw",
                        borderRadius: "1vw", // Increased border radius for rounded edges
                        boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 10px",
                    }}
                >
                    <span
                        style={{
                            position: "absolute",
                            top: "1.5vh",
                            left: "1vw",
                            fontWeight: "bold",
                            color: "#B4B4B8",
                        }}
                    >
                        Adults
                    </span>
                    <span
                        style={{
                            position: "absolute",
                            top: "1.9vh",
                            left: "4.4vw", // Adjust to position it next to "From"
                            fontWeight: "bold",
                            color: "red",
                        }}
                    >
                        *
                    </span>
                    <input
                        type="number"
                        placeholder="Enter number"
                        value={adults}
                        style={{
                            width: "10vw",
                            padding: "1vh",
                            paddingTop: "6vh",
                            borderRadius: "0.5vw",
                            border: "0.1vw solid transparent",
                            outline: "none",
                        }}
                        onChange={(e) => {
                            setAdults(e.target.value);
                        }}
                    />
                </div>

                {/* sisth Small Rectangle beside the button */}
                <div
                    style={{
                        width: "12vw",
                        height: "11vh",
                        backgroundColor: "white",
                        marginRight: "1.5vw",
                        borderRadius: "1vw", // Increased border radius for rounded edges
                        boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 10px",
                    }}
                >
                    <span
                        style={{
                            position: "absolute",
                            top: "1.5vh",
                            left: "1vw",
                            fontWeight: "bold",
                            color: "#B4B4B8",
                        }}
                    >
                        Children
                    </span>
                    <input
                        type="number"
                        placeholder="Enter number"
                        value={children}
                        style={{
                            width: "10vw",
                            padding: "1vh",
                            paddingTop: "6vh",
                            borderRadius: "0.5vw",
                            border: "0.1vw solid transparent",
                            outline: "none",
                        }}
                        onChange={(e) => setChildren(e.target.value)}
                    />
                </div>

                {/* Search Button on the far right of the rectangle */}
                <Button
                    stylingMode="always-dark" // Orange button style
                    text="Search"
                    handleClick={handleSearch}
                    customStyle={{ marginRight: "1vw" }}
                    isLoading={isLoading}
                />
            </div>

            <p style={{ color: "red", marginBottom: "1vh", textAlign: "center" }}>
                {error}
            </p>
        </div>
    );
};

const flightPageSearch = {
    flex: "3",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #898686",
    borderRadius: "40px",
};

export default FlightSearchFields;
