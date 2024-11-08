import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import i1 from "../../assets/images/iti.png";
import i2 from "../../assets/images/i2.png";
import Map from "../map";
const CreateItineraryPage = () => {
    const [name, setName] = useState("");
    const [language, setLanguage] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [pickupLocationlongitude, setPickupLocationlongitude] = useState("");
    const [pickupLocationlatitude, setPickupLocationlatitude] = useState("");
    const [dropOffLocationlongitude, setDropOffLocationlongitude] = useState("");
    const [dropOffLocationlatitude, setDropOffLocationlatitude] = useState("");
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [accessibilityTypes, setAccessibilityTypes] = useState([]);
    const [selectedAccessibility, setSelectedAccessibility] = useState("");
    const [price, setPrice] = useState("");

    const predefinedTags = [
        "Adventure",
        "Relaxation",
        "Cultural",
        "Nature",
        "Family",
        "Romantic",
    ];

    const addTag = () => {
        if (selectedTag && !tags.includes(selectedTag)) {
            setTags([...tags, selectedTag]);
            setSelectedTag("");
        }
    };

    const removeTag = (tag) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const addAccessibilityType = () => {
        if (
            selectedAccessibility &&
            !accessibilityTypes.includes(selectedAccessibility)
        ) {
            setAccessibilityTypes([...accessibilityTypes, selectedAccessibility]);
            setSelectedAccessibility("");
        }
    };

    const removeAccessibilityType = (type) => {
        setAccessibilityTypes(accessibilityTypes.filter((t) => t !== type));
    };

    return (
        <div
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                backgroundColor: "#fff5e6",
                minHeight: "105vh",
                width: "100vw",
            }}
        >
            <div style={{ position: "fixed", top: 0, left: "9%", zIndex: 1 }}>
                {/* <NavBar /> */}
            </div>

            <div>
                <img
                    src={i1}
                    style={{
                        width: "100vw",
                        height: "35vh",
                        pointerEvents: "none",
                        zIndex: -1,
                    }}
                />
                <img
                    src={i2}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "35vh",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "18vh",
                        left: "38vw",
                        fontSize: "3.2vh",
                        fontWeight: "bold",
                        color: "White",
                        pointerEvents: "none",
                    }}
                >
                    Create A New Itinerary
                </div>
            </div>

            <div
                style={{
                    position: "relative",
                    top: "2vh",
                    margin: "0 auto",
                    width: "80vw",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "2vh 5vw",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "2vh",
                    }}
                >
                    <div style={{ width: "45%" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5vh",
                                fontWeight: "bold",
                            }}
                        >
                            Name*
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Insert title here..."
                            style={{
                                width: "100%",
                                padding: "1vh",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>
                    <div style={{ width: "45%" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5vh",
                                fontWeight: "bold",
                            }}
                        >
                            Language*
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "1vh",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                            }}
                        >
                            <option value="">Select language</option>
                            {["Arabic", "English", "Spanish", "French", "German"].map(
                                (language) => (
                                    <option key={language} value={language}>
                                        {language}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "2vh",
                    }}
                >
                    <div style={{ width: "45%" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5vh",
                                fontWeight: "bold",
                            }}
                        >
                            Description*
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Insert description here..."
                            style={{
                                width: "100%",
                                padding: "1vh",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                resize: "vertical",
                            }}
                        />
                    </div>
                    <div style={{ width: "45%" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5vh",
                                fontWeight: "bold",
                            }}
                        >
                            Date & Time*
                        </label>
                        <div style={{ display: "flex" }}>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{
                                    width: "49%",
                                    padding: "1vh",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                    marginRight: "2%",
                                }}
                            />
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                style={{
                                    width: "49%",
                                    padding: "1vh",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "2vh",
                    }}
                >
                    <div style={{ width: "40%" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5vh",
                                fontWeight: "bold",
                            }}
                        >
                            Pin pickup location on map
                        </label>
                        <div
                            style={{
                                width: "100%",
                                height: "auto",
                                backgroundColor: "#e0e0e0",
                                borderRadius: "8px",
                            }}
                        >
                            {
                                <Map
                                    setMarkerPosition={(position) => {
                                        setPickupLocationlongitude(position.lng);
                                        setPickupLocationlatitude(position.lat);
                                    }}
                                />
                            }
                        </div>
                    </div>
                    <div style={{ width: "40%" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5vh",
                                fontWeight: "bold",
                                marginLeft: "-4vw",
                            }}
                        >
                            Pin drop off location on map
                        </label>
                        <div
                            style={{
                                width: "100%",
                                height: "auto",
                                backgroundColor: "#e0e0e0",
                                borderRadius: "8px",
                                marginLeft: "-4vw",
                            }}
                        >
                            {
                                <Map
                                    setMarkerPosition={(position) => {
                                        setDropOffLocationlongitude(position.lng);
                                        setDropOffLocationlatitude(position.lat);
                                    }}
                                />
                            }
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "2vh", marginBottom: "2vh" }}>
                    <div style={{ flex: 1 }}>
                        <label>Tags</label>
                        <div style={{ display: "flex" }}>
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                style={{ flex: 1, padding: "1vh" }}
                            >
                                <option value="">Select tag</option>
                                {predefinedTags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                            <button
                                disabled={!selectedTag}
                                onClick={addTag}
                                style={{ marginLeft: "1vh", padding: "1vh" }}
                            >
                                Add
                            </button>
                        </div>
                        <div
                            style={{
                                marginTop: "1vh",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "1vh",
                            }}
                        >
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    onClick={() => removeTag(tag)}
                                    style={{
                                        padding: "0.5vh 1vh",
                                        backgroundColor: "#f4cfbf",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                >
                                    {tag} ✕
                                </span>
                            ))}
                        </div>
                    </div>
                    <div style={{ flex: 1, marginLeft: "11vh" }}>
                        <label>Accessibility</label>
                        <div style={{ display: "flex" }}>
                            <input
                                type="text"
                                value={selectedAccessibility}
                                onChange={(e) => setSelectedAccessibility(e.target.value)}
                                placeholder="Insert accessibility type"
                                style={{ flex: 1, padding: "1vh" }}
                            />
                            <button
                                onClick={addAccessibilityType}
                                style={{ marginLeft: "1vh", padding: "1vh" }}
                            >
                                Add
                            </button>
                        </div>
                        <div
                            style={{
                                marginTop: "1vh",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "1vh",
                            }}
                        >
                            {accessibilityTypes.map((type, index) => (
                                <span
                                    key={index}
                                    onClick={() => removeAccessibilityType(type)}
                                    style={{
                                        padding: "0.5vh 1vh",
                                        backgroundColor: "#f4cfbf",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                >
                                    {type} ✕
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "2vh",
                    }}
                >
                    <div style={{ width: "45%" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5vh",
                                fontWeight: "bold",
                            }}
                        >
                            Price*
                        </label>
                        <div style={{ display: "flex" }}>
                            <input
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Insert price here..."
                                style={{
                                    width: "80%",
                                    padding: "1vh",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                }}
                            />
                            <div
                                style={{
                                    width: "20%",
                                    textAlign: "center",
                                    padding: "1vh",
                                    backgroundColor: "#f2f2f2",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                    marginLeft: "0.5vh",
                                }}
                            >
                                EGP
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "2vw",
                        marginTop: "3vh",
                    }}
                >
                    <button
                        style={{
                            padding: "1vh 3vw",
                            backgroundColor: "#f5f5f5",
                            border: "none",
                            borderRadius: "20px",
                            color: "#ff6600",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        style={{
                            padding: "1vh 3vw",
                            backgroundColor: "#ff6600",
                            border: "none",
                            borderRadius: "20px",
                            color: "#ffffff",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
    console.log("description", description);
};

export default CreateItineraryPage;
