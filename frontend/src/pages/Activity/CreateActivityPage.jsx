import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axiosInstance from "../../api/axiosInstance";
import { uploadFiles } from "../../api/firebase";
import PhotosUpload from "../../components/PhotosUpload.jsx";
import DateModal from "../../components/DateModal.jsx";
import TimeModal from "../../components/TimeModal.jsx";
import Button from "../../components/Button.jsx";
import usePageHeader from "../../components/Header/UseHeaderPage.jsx";
import NavBar from "../../components/NavBar.jsx";
import Map from "../map";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";

const Popup = ({ message, onClose, isError }) => (
    <PopupContainer isError={isError}>
        <PopupContent>
            {message}
            <CloseButton onClick={onClose}>×</CloseButton>
        </PopupContent>
    </PopupContainer>
);

const defaultData = {
    name: "",
    startDate: "",
    endDate: "",
    latitude: 0,
    longitude: 0,
    category: "",
    tags: [],
    freeSpots: 0,
    isOpenForBooking: false,
};

const CreateActivityPage = () => {
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
        const startString = start ? start.toLocaleDateString() : "";
        const endString = end ? end.toLocaleDateString() : "";
        setFormattedDate(`${startString} to ${endString}`);
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

        fetchCategories();
        fetchTags();
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

        try {
            const convertTo24System = (timeObj) => {
                const [time, period] = timeObj.split(" ");
                let [hours, minutes] = time.split(":").map(Number);
                if (period == "PM" && hours < 12) hours += 12;
                if (period == "AM" && hours === 12) hours = 0;
                return { hours, minutes };
            };

            const combinedStartDate = new Date(startDate);
            const combinedEndDate = new Date(endDate);
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
                freeSpots: parseInt(formData.freeSpots) || 0,
                specialDiscount: parseFloat(formData.specialDiscount) || 0,
                price: parseFloat(formData.price) || 0,
                Latitude: formData.Latitude ? parseFloat(formData.Latitude) : undefined,
                Longitude: formData.Longitude
                    ? parseFloat(formData.Longitude)
                    : undefined,
            };

            console.log(finalFormData);

            Object.keys(finalFormData).forEach(
                (key) => finalFormData[key] === undefined && delete finalFormData[key]
            );

            const response = await axiosInstance.post(
                "/activity/createActivity",
                finalFormData,
                {
                    withCredentials: true,
                }
            );
            console.log("Activity created:", response.data);

            showPopupMessage("Activity created successfully!", false);

            setTimeout(() => navigate("/advertiser/assigned"), 1000);
        } catch (error) {
            console.error("Error creating activity:", error);
            showPopupMessage(
                error.response?.data?.message ||
                    "Error creating activity. Please try again.",
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

    usePageHeader(
        "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fHNvdXZlbmlyJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D",
        "Create a New Activity"
    );

    return (
        <PageContainer>
            {showPopup && (
                <Popup
                    message={popupMessage}
                    onClose={() => setShowPopup(false)}
                    isError={isErrorPopup}
                />
            )}

            <form style={{ marginTop: "35vh" }}>
                <FormContainer>
                    <div>
                        <FormSection>
                            <InputGroup>
                                <Label>Title</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Insert title here..."
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Description</Label>
                                <TextArea
                                    name="description"
                                    placeholder="Insert description here...."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>
                        </FormSection>

                        <FormSection>
                            <FlexGroup>
                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    placeholder="Insert Price here..."
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    style={{ marginLeft: "11em" }}
                                />
                            </FlexGroup>

                            <FlexGroup>
                                <Label>Discount Percentage (%)</Label>
                                <Input
                                    type="number"
                                    name="specialDiscount"
                                    placeholder="Insert discount here..."
                                    value={formData.specialDiscount}
                                    onChange={handleInputChange}
                                    style={{ marginLeft: "0.8em" }}
                                />
                            </FlexGroup>
                        </FormSection>

                        <FormSection>
                            <Label>Date & Time</Label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "2rem",
                                    marginTop: "1rem",
                                }}
                            >
                                <div
                                    style={{
                                        position: "relative",
                                        display: "inline-block",
                                        width: "16rem",
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
                                            width: "14vw",
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
                                            right: "-1rem",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            fontSize: "1.2em",
                                            color: "#888",
                                        }}
                                        onClick={() => setShowDateModal(true)}
                                    />
                                </div>

                                <div
                                    style={{
                                        marginLeft: "2vw",
                                        position: "relative",
                                        display: "inline-block",
                                        width: "16rem",
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={formattedTime}
                                        readOnly
                                        onClick={() => setShowTimeModal(true)}
                                        placeholder="Select Time"
                                        style={{
                                            fontSize: "1.125rem",
                                            width: "14vw",
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
                                            right: "-1rem",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            fontSize: "1.2em",
                                            color: "#888",
                                        }}
                                        onClick={() => setShowTimeModal(true)}
                                    />
                                </div>
                            </div>
                            <DateModal
                                isOpen={showDateModal}
                                onClose={() => setShowDateModal(false)}
                                startDate={startDate}
                                endDate={endDate}
                                onDatesChange={handleDatesChange}
                            />
                            <TimeModal
                                isOpen={showTimeModal}
                                onClose={() => setShowTimeModal(false)}
                                startTime={startTime}
                                endTime={endTime}
                                onTimesChange={handleTimesChange}
                            />
                        </FormSection>

                        <FormSection>
                            <FlexGroup>
                                <Label>Category</Label>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    style={{ minWidth: "27vw" }}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category._id}
                                        </option>
                                    ))}
                                </Select>
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
                                        <Select
                                            value={selectedTag}
                                            onChange={(e) =>
                                                setSelectedTag(e.target.value)
                                            }
                                            style={{
                                                minWidth: "27vw",
                                                marginLeft: "1.7vw",
                                                padding: "1vh 1.5vh",
                                                borderRadius: "0.5vh",
                                                border: "0.1vh solid #ccc",
                                            }}
                                        >
                                            <option value="">Select tag</option>
                                            {tags.map((tag) => (
                                                <option key={tag._id} value={tag._id}>
                                                    {tag._id}
                                                </option>
                                            ))}
                                        </Select>
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            disabled={!selectedTag}
                                            style={{
                                                padding: "1vh 2vh",
                                                backgroundColor: "#f4cfbf",
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
                                                    "#edbdaa";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor =
                                                    "#f4cfbf";
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
                                                    backgroundColor: "#f4cfbf",
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

                        <FormSection style={{ height: "41vh" }}>
                            <Label style={{ marginLeft: "2em" }}>
                                Pin Activity Location on Map
                            </Label>
                            <Map
                                setMarkerPosition={(position) => {
                                    setFormData({
                                        ...formData,
                                        latitude: position.lat,
                                        longitude: position.lng,
                                    });
                                }}
                            />
                        </FormSection>

                        <FormSection>
                            <FlexGroup>
                                <Label>Booking</Label>
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
                                                ? "#fcd8d8"
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
                                                ? "#fcd8d8"
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
                                <Label>Capacity</Label>
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
                            stylingMode="2"
                            text="Cancel"
                            handleClick={() => navigate("/advertiser/assigned")}
                            width="auto"
                        />
                        <Button
                            stylingMode="1"
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
    background: #faf4f4;
    padding: clamp(1em, 3vw, 2em);
    border-radius: 1em;
    box-shadow: 0 0.125em 0.5em rgba(0, 0, 0, 0.1);
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
    background-color: #f28b82;
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

export default CreateActivityPage;
