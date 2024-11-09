//import React from "react";
import usePageHeader from "../../components/Header/UseHeaderPage";
import backgroundImage from "../../assets/images/flightsBackgroundImage.png";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import Button from "../../components/Button"; // Import the Button component
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Flights = () => {
    usePageHeader(null, null);
    const [startDate, setStartDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null); // Return Date
    const [keyword, setKeyword] = useState(""); // Search keyword
    const [suggestions, setSuggestions] = useState([]); // Search suggestions
    const [keyword2, setKeyword2] = useState(""); // Search keyword
    const [suggestions2, setSuggestions2] = useState([]); // Search suggestions

    // Fetch airport/city suggestions from the backend as the user types
    // Function to fetch suggestions from the backend
    const fetchSuggestions = async (keyword) => {
        if (keyword.length > 0) {
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
        if (keyword2.length > 0) {
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

    return (
        <div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
            {/* Background Image */}
            <div
                style={{
                    width: "100vw",
                    height: "30vh",
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>

            {/* NavBar */}
            <div style={{ position: "fixed", top: 0, left: "9%" }}>
                <NavBar />
            </div>

            {/* Rectangle Section */}
            <div
                style={{
                    width: "91.5vw",
                    height: "15vh",
                    backgroundColor: "#FDDDCE",
                    margin: "2vh auto",
                    padding: "2vh",
                    borderRadius: "1vw",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                {/* First Small Rectangle with "From" Label and Search Field */}
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
                        From
                    </span>
                    <span
                        style={{
                            position: "absolute",
                            top: "1.9vh",
                            left: "3.7vw", // Adjust to position it next to "From"
                            fontWeight: "bold",
                            color: "red",
                        }}
                    >
                        *
                    </span>

                    {/* Search Input Field */}
                    <input
                        type="text"
                        value={keyword} // This will now show both the city name and IATA code
                        onChange={handleInputChange} // Call handleInputChange on each input change
                        onFocus={() => keyword && fetchSuggestions(keyword)} // Refetch suggestions on focus if keyword exists
                        placeholder="City or Airport"
                        style={{
                            width: "10vw",
                            padding: "1vh",
                            paddingTop: "6vh",
                            borderRadius: "0.5vw",
                            border: "0.1vw solid transparent",
                            outline: "none",
                        }}
                    />

                    {/* Display dropdown of suggestions if there are any */}
                    {suggestions.length > 0 && (
                        <div
                            style={{
                                position: "absolute",
                                top: "9vh", // Position it below the input field
                                left: "0",
                                width: "100%",
                                backgroundColor: "white",
                                boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                                maxHeight: "20vh", // Limit height for scrollable dropdown
                                overflowY: "scroll",
                                borderRadius: "0.5vw",
                                zIndex: "1",
                            }}
                        >
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "0.5vh",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        // Set keyword with city name and IATA code format
                                        setKeyword(
                                            `${suggestion.name} (${suggestion.iataCode})`
                                        );
                                        setSuggestions([]); // Clear suggestions to close dropdown
                                    }}
                                >
                                    {suggestion.name} ({suggestion.iataCode})
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Second Small Rectangle with "To" Label */}
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
                        To
                    </span>
                    <span
                        style={{
                            position: "absolute",
                            top: "1.9vh",
                            left: "2.4vw", // Adjust to position it next to "From"
                            fontWeight: "bold",
                            color: "red",
                        }}
                    >
                        *
                    </span>
                    {/* Second Search Input Field */}
                    <input
                        type="text"
                        value={keyword2} // Bind input field to keyword2 state
                        onChange={handleInputChange2} // Call handleInputChange2 on each input change
                        onFocus={() => keyword2 && fetchSuggestions2(keyword2)} // Refetch suggestions on focus if keyword2 exists
                        placeholder="City or Airport"
                        style={{
                            width: "10vw",
                            padding: "1vh",
                            paddingTop: "6vh",
                            borderRadius: "0.5vw",
                            border: "0.1vw solid transparent",
                            outline: "none",
                        }}
                    />

                    {/* Display dropdown of suggestions if there are any for the second input field */}
                    {suggestions2.length > 0 && (
                        <div
                            style={{
                                position: "absolute",
                                top: "9vh", // Position it below the input field
                                left: "0",
                                width: "100%",
                                backgroundColor: "white",
                                boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                                maxHeight: "20vh", // Limit height for scrollable dropdown
                                overflowY: "scroll",
                                borderRadius: "0.5vw",
                                zIndex: "1",
                            }}
                        >
                            {suggestions2.map((suggestion2, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "0.5vh",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        // Set keyword2 with city name and IATA code format
                                        setKeyword2(
                                            `${suggestion2.name} (${suggestion2.iataCode})`
                                        );
                                        setSuggestions2([]); // Clear suggestions to close dropdown
                                    }}
                                >
                                    {suggestion2.name} ({suggestion2.iataCode})
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* third Small Rectangle */}
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
                        flexDirection: "column", // Stack label and input vertically
                        justifyContent: "center", // Center vertically within the container
                        padding: "0 10px",
                    }}
                >
                    <span
                        style={{
                            fontWeight: "bold",
                            color: "#B4B4B8",
                            marginBottom: "1vh", // Reduced margin to keep it compact
                        }}
                    >
                        Departure
                    </span>
                    <span
                        style={{
                            position: "absolute",
                            top: "1.9vh",
                            left: "5.8vw", // Adjust to position it next to "From"
                            fontWeight: "bold",
                            color: "red",
                        }}
                    >
                        *
                    </span>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy" // Day, month, year format
                        placeholderText="Select date" // Placeholder text here
                        style={{
                            width: "7vw",
                            padding: "1vh", // Adjusted padding to fit in the container
                            borderRadius: "0.5vw",
                            border: "0.1vw solid transparent",
                            outline: "none", // Removes blue outline on focus
                        }}
                    />
                </div>

                {/* fourth Small Rectangle */}
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
                        flexDirection: "column", // Stack label and input vertically
                        justifyContent: "center", // Center vertically within the container
                        padding: "0 10px",
                    }}
                >
                    <span
                        style={{
                            fontWeight: "bold",
                            color: "#B4B4B8",
                            marginBottom: "1vh", // Reduced margin to keep it compact
                        }}
                    >
                        Return
                    </span>
                    <DatePicker
                        selected={returnDate}
                        onChange={(date) => setReturnDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select date"
                        style={{
                            width: "7vw",
                            padding: "1vh",
                            borderRadius: "0.5vw",
                            border: "0.1vw solid transparent",
                            outline: "none",
                        }}
                    />
                </div>

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
                        style={{
                            width: "10vw",
                            padding: "1vh",
                            paddingTop: "6vh",
                            borderRadius: "0.5vw",
                            border: "0.1vw solid transparent",
                            outline: "none",
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
                        style={{
                            width: "10vw",
                            padding: "1vh",
                            paddingTop: "6vh",
                            borderRadius: "0.5vw",
                            border: "0.1vw solid transparent",
                            outline: "none",
                        }}
                    />
                </div>

                {/* Search Button on the far right of the rectangle */}
                <Button
                    stylingMode="2" // Orange button style
                    text="Search"
                    handleClick={() => console.log("Searching flights...")}
                    customStyle={{ marginRight: "1vw" }}
                />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Flights;
