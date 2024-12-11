import React, {useState, useEffect} from "react";
import styled, { keyframes } from "styled-components";
import axiosInstance from "../../api/axiosInstance";
import { uploadFiles } from "../../api/firebase";
import PhotosUpload from "../../components/PhotosUpload.jsx";
import DateModal from "../../components/DateModal.jsx";
import TimeModal from "../../components/TimeModal.jsx";
import Button from "../../components/Button.jsx";
import usePageHeader from "../../components/Header/UseHeaderPage.jsx";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {useNavigate, useParams} from "react-router-dom";
import TextField from "@mui/material/TextField";
import LocationAdder from "../../components/LocationAdder.jsx";
import MapPopUp from "../../components/MapPopUp.jsx";
import CurrencyDropdown from "../../components/CurrencyDropdownList.jsx";
import { useCurrencyConverter } from "../../hooks/currencyHooks.js";
import Cookies from "js-cookie";
import GenericDropDown from "../../components/GenericDropDown.jsx";
import {CircularProgress} from "@mui/material";

const Popup = ({ message, onClose, isError }) => (
    <PopupContainer isError={isError}>
        <PopupContent>
            {message}
            <CloseButton onClick={onClose}>×</CloseButton>
        </PopupContent>
    </PopupContainer>
);

const defaultData = {
    startDate: "",
    endDate: "",
    latitude: 0,
    longitude: 0,
    location: "",
    category: "",
    tags: [],
    freeSpots: 0,
    isOpenForBooking: false,
};

const UpdateActivityPage = () => {
    const [formData, setFormData] = useState(defaultData);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [isErrorPopup, setIsErrorPopup] = useState(false);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [showDateModal, setShowDateModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [formattedDate, setFormattedDate] = useState("");
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [formattedTime, setFormattedTime] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const currency = Cookies.get("currency") || "EGP";
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { isLoading, formatPrice, convertPrice } = useCurrencyConverter(currency);

    const activityId = useParams();

    const [pickupLocation, setPickupLocation] = useState({
        latitude: 0,
        longitude: 0,
        location: "",
    });

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [mapFunction, setMapFunction] = useState(null);
    useEffect(() => {
        console.log(mapFunction);
        if (mapFunction) setIsMapOpen(true);
    }, [mapFunction]);

    const navigate = useNavigate();

    const handleTimesChange = (start, end) => {
        setStartTime(start);
        setEndTime(end);
        const startString = start || "";
        const endString = end || "";
        setFormattedTime(`${startString} to ${endString}`);
    };

    const addTag = () => {
        if (selectedTag && !selectedTags.includes(selectedTag)) {
            setSelectedTags([...selectedTags, selectedTag]);
            setSelectedTag("");
        }
    };

    const removeTag = (tagToRemove, e) => {
        e.preventDefault();
        setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
    };

    const handleDatesChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        console.log(startDate);
        const startString = start ? start.toLocaleDateString() : "";
        const endString = end ? end.toLocaleDateString() : "";
        setFormattedDate(`${startString}`);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get("category/allCategories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchTags = async () => {
            try {
                const response = await axiosInstance.get("tag/allTags");
                setTags(response.data);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        const fetchActivity = async () => {
            try {
                const response = await axiosInstance.get(`activity/getActivity/${activityId.id}`);
                setFormData(response.data);
                setSelectedTags(response.data.tags);
                setSelectedCategory(response.data.category);
                setImagePreviews(response.data.pictures);
                const curPickupLocation = {
                    location: response.data.location,
                    latitude: response.data.Latitude,
                    longitude: response.data.Longitude
                }
                setPickupLocation(curPickupLocation);
                console.log("databse: ", response.data.startDate.toLocaleString());
                setStartDate(response.data.startDate);

            } catch(error) {
                console.error("Error fetching activity:", error);
            }
        };

        fetchActivity();
        fetchCategories();
        fetchTags();
        setIsPageLoading(false);
    }, []);


    const handleInputChange = (e) => {
        let { name, value, type, checked } = e.target;
        if (type === "number" && isNaN(value)) return;
        if (type == "number") value = Math.max(value, 0);
        if (name == "specialDiscount") value = Math.min(value, 100);
        if (name === "tags") {
            if (checked) {
                setSelectedTags([...selectedTags, value]);
            } else {
                setSelectedTags(selectedTags.filter((tag) => tag !== value));
            }
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleStockChange = (change) => {
        setFormData((prev) => ({
            ...prev,
            freeSpots: Math.max(0, prev.freeSpots + change),
        }));
    };

    const showPopupMessage = (message, isError) => {
        setPopupMessage(message);
        setIsErrorPopup(isError);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.category = selectedCategory;
        console.log(formData);

        if (
            (!formData.name ||
            !formData.description ||
            !startDate ||
            !endDate ||
            !formData.price ||
            !formData.category ||
            imagePreviews.length === 0,
                !formData.freeSpots)
        ) {
            showPopupMessage("Please fill out all required details.", true);
            return;
        }

        if (tags.length === 0 || selectedTags.length === 0) {
            showPopupMessage("Please select at least one tag.", true);
            return;
        }

        function destructureDate(date) {
            if (!(date instanceof Date)) {
                date = new Date(date);
            }
            let hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            return {hours, minutes, ampm};
        }

        try {
            const convertTo24System = (timeObj) => {
                const [time, period] = timeObj.split(" ");
                let [hours, minutes] = time.split(":").map(Number);
                if (period == "PM" && hours < 12) hours += 12;
                if (period == "AM" && hours === 12) hours = 0;
                return { hours, minutes };
            };

            const combinedStartDate = new Date(startDate);
            const combinedEndDate = new Date(startDate);
            const startTime24 = convertTo24System(startTime);
            const endTime24 = convertTo24System(endTime);
            combinedStartDate.setHours(startTime24.hours, startTime24.minutes);
            combinedEndDate.setHours(endTime24.hours, endTime24.minutes);

            const files = imagePreviews.map((preview) => preview.file);
            const uploadedFileUrls = await uploadFiles(files, "activities");

            const finalFormData = {
                ...formData,
                startDate: combinedStartDate.toISOString(),
                endDate: combinedEndDate.toISOString(),
                pictures: uploadedFileUrls,
                tags: selectedTags,
                initialFreeSpots: parseInt(formData.freeSpots) || 0,
                specialDiscount: parseFloat(formData.specialDiscount) || 0,
                price:
                    parseFloat(convertPrice(formData.price, selectedCurrency, "EGP")) ||
                    0,
                Latitude: pickupLocation.latitude
                    ? parseFloat(pickupLocation.latitude)
                    : undefined,
                Longitude: pickupLocation.longitude
                    ? parseFloat(pickupLocation.longitude)
                    : undefined,
                location: pickupLocation.location,
            };

            console.log(pickupLocation);

            Object.keys(finalFormData).forEach(
                (key) => finalFormData[key] === undefined && delete finalFormData[key]
            );

            const response = await axiosInstance.post(
                "/activity/updateActivity",
                finalFormData,
                {
                    withCredentials: true,
                }
            );
            console.log("Activity updated:", response.data);

            showPopupMessage("Activity updated successfully!", false);

            setTimeout(() => navigate("/advertiser/assigned"), 1000);
        } catch (error) {
            console.error("Error updating activity:", error);
            showPopupMessage(
                error.response?.data?.message ||
                "Error updating activity. Please try again.",
                true
            );
        }
    };

    const handleImageAdd = (newImages) => {
        setImagePreviews((prev) => [...prev, ...newImages]);
    };

    const handleImageRemove = (idToRemove) => {
        setImagePreviews((prev) => prev.filter((image) => image.id !== idToRemove));
    };

    const inputStyles = {
        width: "100%", // Or a specific value like "20rem"
        height: "3rem",
    };

    usePageHeader(
        "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fHNvdXZlbmlyJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D",
        "Update Activity"
    );

    if (isPageLoading) {
        return <CircularProgress/>;
    }

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
                style={{ marginTop: "35vh" }}
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
                                    variant="outlined"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    style={inputStyles}
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Description</Label>

                                <TextField
                                    name="description"
                                    id="outlined-basic"
                                    variant="outlined"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    style={inputStyles}
                                />
                            </InputGroup>

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
                                onDatesChange={handleDatesChange}
                            />
                            <TimeModal
                                isOpen={showTimeModal}
                                onClose={() => setShowTimeModal(false)}
                                startTime={startTime}
                                endTime={endTime}
                                onTimesChange={handleTimesChange}
                            />
                            <InputGroup>
                                <div style={{ marginBottom: "3vh" }}>
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
                                </div>
                            </InputGroup>

                            <FlexGroup>
                                <Label>Category</Label>
                                <div style={{width:'60%'}}>
                                    <GenericDropDown
                                        options={categories}
                                        selectedItem={selectedCategory}
                                        setSelectedItem={setSelectedCategory}
                                        label={"category"}
                                    />
                                </div>
                            </FlexGroup>

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
                                            options={tags}
                                            selectedItem={selectedTag}
                                            setSelectedItem={setSelectedTag}
                                            label={"tag"}
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
                                        {selectedTags.map((tag, index) => (
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
                        </FormSection>
                    </div>
                    <div>
                        <PhotosUpload
                            label="Activity Photos"
                            imagePreviews={imagePreviews}
                            onImageAdd={handleImageAdd}
                            onImageRemove={handleImageRemove}
                        />

                        <FormSection>
                            <FlexGroup>
                                <Label>Open for Booking</Label>
                                <div
                                    style={{
                                        display: "flex",
                                        borderRadius: "3em",
                                        overflow: "hidden",
                                        backgroundColor: "#eaeaea",
                                        padding: "0.2em",
                                    }}
                                >
                                    <div
                                        onClick={() =>
                                            handleInputChange({
                                                target: {
                                                    name: "isOpenForBooking",
                                                    value: true,
                                                },
                                            })
                                        }
                                        style={{
                                            padding: "0.5em 1em",
                                            cursor: "pointer",
                                            fontSize: "1em",
                                            fontWeight: "500",
                                            color: formData.isOpenForBooking
                                                ? "#a83232"
                                                : "#333",
                                            backgroundColor: formData.isOpenForBooking
                                                ? "#ECD1B4"
                                                : "transparent",
                                            borderRadius: "3em",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        Open
                                    </div>
                                    <div
                                        onClick={() =>
                                            handleInputChange({
                                                target: {
                                                    name: "isOpenForBooking",
                                                    value: false,
                                                },
                                            })
                                        }
                                        style={{
                                            padding: "0.5em 1em",
                                            cursor: "pointer",
                                            fontSize: "1em",
                                            fontWeight: "500",
                                            color: !formData.isOpenForBooking
                                                ? "#a83232"
                                                : "#333",
                                            backgroundColor: !formData.isOpenForBooking
                                                ? "#ECD1B4"
                                                : "transparent", // Matching background color
                                            borderRadius: "1em",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        Closed
                                    </div>
                                </div>
                            </FlexGroup>
                            <FlexGroup>
                                <Label>Number of seats</Label>
                                <StockControl>
                                    <StockButton
                                        type="button"
                                        onClick={() => handleStockChange(-1)}
                                    >
                                        -
                                    </StockButton>
                                    <input
                                        type="number"
                                        value={formData.freeSpots}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                freeSpots:
                                                    parseInt(e.target.value, 10) || 0,
                                            })
                                        }
                                        style={{
                                            width: "3em",
                                            textAlign: "center",
                                            fontSize: "1.2em",
                                            fontWeight: "bold",
                                            border: "none",
                                            outline: "none",
                                            backgroundColor: "transparent",
                                        }}
                                    />
                                    <StockButton
                                        type="button"
                                        onClick={() => handleStockChange(1)}
                                    >
                                        +
                                    </StockButton>
                                </StockControl>
                            </FlexGroup>
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
                                            selectedCurrency={selectedCurrency}
                                            setSelectedCurrency={setSelectedCurrency}
                                        />

                                        <TextField
                                            name="price"
                                            id="outlined-basic"
                                            variant="outlined"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleInputChange}
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

                            <FlexGroup>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column", // Stacks children vertically
                                        width: "100%", // Ensures the text field takes up the full width
                                        gap: "1rem", // Adds spacing between elements
                                    }}
                                >
                                    <Label>Discount (%)</Label>
                                    <TextField
                                        name="specialDiscount"
                                        id="outlined-basic"
                                        variant="outlined"
                                        type="number"
                                        value={formData.specialDiscount}
                                        onChange={handleInputChange}
                                        inputProps={{
                                            step: "0.01", // Allows decimals if required
                                            min: "0", // Enforce a minimum discount of 0
                                            max: "100", // Enforce a maximum discount of 100 (if it's a percentage)
                                        }}
                                        style={inputStyles}
                                    />
                                </div>
                            </FlexGroup>
                        </FormSection>
                    </div>
                </FormContainer>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ButtonGroup>
                        <Button
                            stylingMode="dark-when-hovered"
                            text="Cancel"
                            handleClick={() => navigate("/advertiser/assigned")}
                            width="auto"
                        />
                        <Button
                            stylingMode="always-dark"
                            text="Create Activity"
                            handleClick={handleSubmit}
                            width="auto"
                        />
                    </ButtonGroup>
                </div>
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
    width: 90vw;
    max-width: 75em;
    margin: 0 auto;
    padding: 2em;
`;

const FormContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4em;

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

const Input = styled.input`
    width: 20em;
    padding: 0.75em;

    border: 0.0625em solid #e0e0e0;
    border-radius: 0.5em;
    font-size: 1em;
    &::placeholder {
        color: #9e9e9e;
    }
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

const StockControl = styled.div`
    display: flex;
    align-items: center;
`;

const StockButton = styled.button`
    background-color: #ecd1b4;
    color: #fff;
    padding: 0.5rem;
    font-size: 1.2rem;
    border: none;
    min-width: 1.5em;
    border-radius: 0.3em;
    cursor: pointer;

    &:hover {
        background-color: #d77d7d;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1em;
    margin-top: 2em;
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

export default UpdateActivityPage;
