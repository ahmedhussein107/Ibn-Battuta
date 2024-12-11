import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axiosInstance from "../api/axiosInstance";
import DateModal from "./DateModal.jsx";
import TimeModal from "./TimeModal.jsx";
import Button from "./Button.jsx";
import usePageHeader from "./Header/UseHeaderPage.jsx";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import LocationAdder from "./LocationAdder.jsx";
import MapPopUp from "./MapPopUp.jsx";
import CurrencyDropdown from "./CurrencyDropdownList.jsx";
import { useCurrencyConverter } from "../hooks/currencyHooks.js";
import Cookies from "js-cookie";
import GenericDropDown from "./GenericDropDown.jsx";

const Popup = ({ message, onClose, isError }) => (
    <PopupContainer isError={isError}>
        <PopupContent>
            {message}
            <CloseButton onClick={onClose}>×</CloseButton>
        </PopupContent>
    </PopupContainer>
);

const defaultData = {
    startDate: null,
    endDate: null,
    latitude: 0,
    longitude: 0,
    location: "",
    category: "",
    tags: [],
    freeSpots: 0,
    isOpenForBooking: false,
};

const MyForm = ({
    name,
    setName,
    price,
    setPrice,
    description,
    setDescription,
    pickupLocation,
    setPickupLocation,
    dropoffLocation,
    setDropoffLocation,
    startDate,
    setStartDate,
    tags,
    setTags,
    accessibility,
    setAccessibility,
    language,
    setLanguage,
    handleSubmit,
    currency,
    setCurrency,
    formattedDate,
    setFormattedDate,
    formattedTime,
    setFormattedTime,
}) => {
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [isErrorPopup, setIsErrorPopup] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [allTags, setAllTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [Loading, setLoading] = useState(false);

    const currentCurrency = Cookies.get("currency") || "EGP";
    const { isLoading, formatPrice, convertPrice } =
        useCurrencyConverter(currentCurrency);

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [mapFunction, setMapFunction] = useState(null);

    useEffect(() => {
        if (mapFunction) setIsMapOpen(true);
    }, [mapFunction]);

    const navigate = useNavigate();

    const addTag = () => {
        if (selectedTag && !tags.includes(selectedTag)) {
            setTags([...tags, selectedTag]);
            setSelectedTag("");
        }
    };

    const removeTag = (tagToRemove, e) => {
        e.preventDefault();
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const convertTo24System = (timeObj) => {
        const [time, period] = timeObj.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (period == "PM" && hours < 12) hours += 12;
        if (period == "AM" && hours === 12) hours = 0;
        return { hours, minutes };
    };

    const handleTimesChange = (start) => {
        const parsedStartTime = convertTo24System(start);
        let newStartDate = new Date(startDate);
        newStartDate.setHours(parsedStartTime.hours, parsedStartTime.minutes);
        setStartDate(newStartDate);
        setStartTime(start);
        const startString = start || "";
        setFormattedTime(`${startString}`);
    };
    const handleDatesChange = (start) => {
        let newStartDate = new Date(start);
        if (startTime) {
            const parsedStartTime = convertTo24System(startTime);
            newStartDate.setHours(parsedStartTime.hours, parsedStartTime.minutes);
        }
        setStartDate(newStartDate);
        const startString = start ? start.toLocaleDateString() : "";
        setFormattedDate(`${startString}`);
    };

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axiosInstance.get("tag/allTags");
                setAllTags(response.data);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchTags();
    }, []);

    const showPopupMessage = (message, isError) => {
        setPopupMessage(message);
        setIsErrorPopup(isError);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!name || !description || !formattedDate || !formattedTime || !price) {
            console.log("popup does not work");
            showPopupMessage("Please fill out all required details.", true);
            return;
        }

        if (tags.length === 0) {
            showPopupMessage("Please select at least one tag.", true);
            return;
        }

        try {
            setLoading(true);
            await handleSubmit();

            showPopupMessage("Activity created successfully!", false);

            setTimeout(() => navigate("/tourguide/assigned"), 1000);
        } catch (error) {
            console.error("Error creating Itinerary:", error);
            showPopupMessage(
                error.response?.data?.message ||
                    "Error creating activity. Please try again.",
                true
            );
        }
    };

    const inputStyles = {
        width: "100%", // Or a specific value like "20rem"
        height: "3rem",
    };

    return (
        <PageContainer>
            {showPopup && (
                <Popup
                    message={popupMessage}
                    onClose={() => setShowPopup(false)}
                    isError={isErrorPopup}
                />
            )}

            <form
                style={{}}
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}
            >
                <FormContainer>
                    <div>
                        <FormSection>
                            <InputGroup>
                                <Label>Title</Label>
                                <TextField
                                    name="name"
                                    id="outlined-basic"
                                    label="Insert title here..."
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    style={inputStyles}
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Description</Label>

                                <TextField
                                    name="description"
                                    id="outlined-basic"
                                    label="Insert description here...."
                                    variant="outlined"
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    style={inputStyles}
                                />
                            </InputGroup>

                            <FlexGroup
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    minHeight: "9vh",
                                }}
                            >
                                <Label
                                    style={{
                                        paddingTop: "1vh",
                                    }}
                                >
                                    Language
                                </Label>
                                <GenericDropDown
                                    options={[
                                        { _id: "English" },
                                        { _id: "Arabic" },
                                        { _id: "French" },
                                        { _id: "Spanish" },
                                        { _id: "German" },
                                    ]}
                                    selectedItem={language}
                                    setSelectedItem={setLanguage}
                                    label="language"
                                />
                            </FlexGroup>

                            <Label>Date & Time</Label>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "2rem",
                                    marginTop: "1rem",
                                }}
                            >
                                {/* First Date & Time Section */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        width: "16rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={formattedDate}
                                            readOnly
                                            onClick={() => setShowDateModal(true)}
                                            placeholder="Select Date"
                                            style={{
                                                fontSize: "1.125rem",
                                                width: "100%",
                                                height: "3rem",
                                                paddingLeft: "1rem",
                                                paddingRight: "2.5rem",
                                                border: "1px solid #ddd",
                                                borderRadius: "0.375rem",
                                                cursor: "pointer",
                                            }}
                                        />
                                        <CalendarTodayIcon
                                            style={{
                                                position: "absolute",
                                                left: "15vw",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                cursor: "pointer",
                                                fontSize: "1.2em",
                                                color: "#9C4F21",
                                            }}
                                            onClick={() => setShowDateModal(true)}
                                        />
                                    </div>
                                    <div style={{ position: "relative", width: "100%" }}>
                                        <input
                                            type="text"
                                            value={formattedTime}
                                            readOnly
                                            onClick={() => setShowTimeModal(true)}
                                            placeholder="Select Time"
                                            style={{
                                                fontSize: "1.125rem",
                                                width: "100%",
                                                height: "3rem",
                                                paddingLeft: "1rem",
                                                paddingRight: "2.5rem",
                                                border: "1px solid #ddd",
                                                borderRadius: "0.375rem",
                                                cursor: "pointer",
                                            }}
                                        />
                                        <AccessTimeIcon
                                            style={{
                                                position: "absolute",
                                                left: "15vw",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                cursor: "pointer",
                                                fontSize: "1.2em",
                                                color: "#9C4F21",
                                            }}
                                            onClick={() => setShowTimeModal(true)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <DateModal
                                isOpen={showDateModal}
                                onClose={() => setShowDateModal(false)}
                                startDate={startDate}
                                endDate={null}
                                onDatesChange={handleDatesChange}
                            />
                            <TimeModal
                                isOpen={showTimeModal}
                                onClose={() => setShowTimeModal(false)}
                                startTime={startTime}
                                endTime={endTime}
                                onTimesChange={handleTimesChange}
                                title={"Select Pickup Time"}
                                showEndTime={false}
                            />
                            <InputGroup>
                                <div style={{ marginTop: "3vh" }}>
                                    {isMapOpen && (
                                        <MapPopUp
                                            popUpOpen={isMapOpen}
                                            setPopUpOpen={setIsMapOpen}
                                            mapFunction={mapFunction}
                                        />
                                    )}

                                    <LocationAdder
                                        title="Pickup Location"
                                        styles={{ width: "100%" }}
                                        location={pickupLocation}
                                        setLocation={setPickupLocation}
                                        setMapFunction={setMapFunction}
                                    />

                                    <LocationAdder
                                        title="Dropoff Location"
                                        styles={{ width: "100%" }}
                                        location={dropoffLocation}
                                        setLocation={setDropoffLocation}
                                        setMapFunction={setMapFunction}
                                    />
                                </div>
                            </InputGroup>

                            <FlexGroup
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "2vh",
                                    minHeight: "9vh",
                                }}
                            >
                                <Label
                                    style={{
                                        paddingTop: "1vh",
                                    }}
                                >
                                    Tags
                                </Label>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", gap: "1vh" }}>
                                        <GenericDropDown
                                            options={allTags}
                                            selectedItem={selectedTag}
                                            setSelectedItem={setSelectedTag}
                                            label="tag"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            disabled={!selectedTag}
                                            style={{
                                                padding: "1vh 2vh",
                                                backgroundColor: "#ECD1B4",
                                                border: "none",
                                                borderRadius: "0.5vh",
                                                cursor: selectedTag
                                                    ? "pointer"
                                                    : "not-allowed",
                                                opacity: selectedTag ? 1 : 0.6,
                                                transition: "background-color 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor =
                                                    "#EDC294";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor =
                                                    "#ECD1B4";
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <TagContainer
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "1vh",
                                            marginTop: "1.5vh",
                                            marginLeft: "1.7vw",
                                        }}
                                    >
                                        {tags.map((tag, index) => (
                                            <Tag
                                                key={index}
                                                onClick={(e) => removeTag(tag, e)}
                                                style={{
                                                    padding: "0.5vh 1vh",
                                                    backgroundColor: "#ECD1B4",
                                                    borderRadius: "0.5vh",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {tag} ✕
                                            </Tag>
                                        ))}
                                    </TagContainer>
                                </div>
                            </FlexGroup>
                            <InputGroup>
                                <Label>Accessibility</Label>
                                <TextField
                                    name="name"
                                    id="outlined-basic"
                                    label="Insert title here..."
                                    variant="outlined"
                                    value={accessibility}
                                    onChange={(e) => {
                                        setAccessibility([e.target.value]);
                                    }}
                                    style={inputStyles}
                                />
                            </InputGroup>
                            <FlexGroup>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column", // Stacks children vertically
                                        width: "100%", // Ensures the text field takes up the full width
                                        gap: "1rem", // Adds spacing between elements
                                    }}
                                >
                                    <Label>Price</Label>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column", // Stacks children vertically
                                            width: "100%", // Ensures the text field takes up the full width
                                            gap: "1rem", // Adds spacing between elements
                                        }}
                                    >
                                        <CurrencyDropdown
                                            selectedCurrency={currency}
                                            setSelectedCurrency={setCurrency}
                                        />

                                        <TextField
                                            name="price"
                                            id="outlined-basic"
                                            label="Insert Price here..."
                                            variant="outlined"
                                            type="number"
                                            value={price}
                                            onChange={(e) => {
                                                setPrice(e.target.value);
                                            }}
                                            style={{
                                                width: "100%", // Ensures the text field takes up the full width
                                            }}
                                            inputProps={{
                                                step: "0.01", // Allows decimal values if needed
                                                min: "0", // Enforces a minimum value of 0
                                            }}
                                        />
                                    </div>
                                </div>
                            </FlexGroup>
                        </FormSection>
                    </div>
                </FormContainer>
                <ButtonGroup>
                    <Button
                        stylingMode="dark-when-hovered"
                        text="Cancel"
                        handleClick={() => {
                            navigate(-1);
                        }}
                        width="auto"
                    />
                    <Button
                        stylingMode="always-dark"
                        text="Create Itinerary"
                        handleClick={handleCreate}
                        width="auto"
                        isLoading={Loading}
                    />
                </ButtonGroup>
            </form>
        </PageContainer>
    );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PopupContainer = styled.div`
    position: fixed;
    top: 8em;
    right: 1em;
    z-index: 1000;
    animation: ${fadeIn} 0.3s ease;
    background-color: ${({ isError }) => (isError ? "#f8d7da" : "#d4edda")};
`;

const PopupContent = styled.div`
    color: ${({ isError }) => (isError ? "#721c24" : "#155724")};
    padding: 1em 1.5em;
    border-radius: 0.25em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1em;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: inherit;
    font-size: 1.2em;
    cursor: pointer;
`;

const PageContainer = styled.div`
    width: 100%;
    max-width: 75em;
`;

const FormContainer = styled.div`
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const FormSection = styled.div`
    background: #ffffff;
    padding: clamp(1em, 3vw, 2em);
    border-radius: 1em;
    box-shadow: 0 0.125em 0.5em rgba(0, 0, 0, 0.3);
    margin-bottom: 2em;
`;

const InputGroup = styled.div`
    margin-bottom: 1.5em;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1em;
    margin-top: 2em;
`;

const FlexGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 1em;
    min-height: 5em;
    margin-bottom: 1.5em;
`;

const Label = styled.label`
    display: block;
    width: 10em; /* Set a fixed width */
    text-align: left; /* Ensure alignment */
    font-size: 1.1em;
    font-weight: 500;
    margin-bottom: 0.5em;
`;

const Select = styled.select`
    padding: 1vh;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 0.9em;
`;

const TagContainer = styled.div`
    margin-top: 1vh;
    display: flex;
    flex-wrap: wrap;
    gap: 1vh;
`;

const Tag = styled.span`
    padding: 0.5vh 1vh;
    background-color: #f4cfbf;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5vh;
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 0.75em;
    border: 0.0625em solid #e0e0e0;
    border-radius: 0.5em;
    font-size: 1em;
    min-height: 7.5em;
    resize: vertical;
    &::placeholder {
        color: #9e9e9e;
    }
`;

export default MyForm;
