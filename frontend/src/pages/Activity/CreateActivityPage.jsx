import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axiosInstance from "../../api/axiosInstance";
import { uploadFiles } from "../../api/firebase";
import PhotosUpload from "../../components/PhotosUpload.jsx";
import Button from "../../components/Button.jsx";
import usePageHeader from "../../components/Header/UseHeaderPage.jsx";
import NavBar from "../../components/NavBar.jsx";
import Map from "../map";
import DatePicker from "react-datepicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Popup = ({ message, onClose, isError }) => (
    <PopupContainer isError={isError}>
        <PopupContent>
            {message}
            <CloseButton onClick={onClose}>×</CloseButton>
        </PopupContent>
    </PopupContainer>
);

const TimeModal = ({ isOpen, onClose, startTime, endTime, onTimesChange }) => {
    const [startHour, setStartHour] = useState(startTime ? parseInt(startTime.split(":")[0]) : "1");
    const [startMinute, setStartMinute] = useState(startTime ? parseInt(startTime.split(":")[1]) : "0");
    const [startPeriod, setStartPeriod] = useState("AM");
    const [endHour, setEndHour] = useState(endTime ? parseInt(endTime.split(":")[0]) : "1");
    const [endMinute, setEndMinute] = useState(endTime ? parseInt(endTime.split(":")[1]) : "0");
    const [endPeriod, setEndPeriod] = useState("AM");

    // Validation functions
    const validateHour = (value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        const hour = parseInt(numericValue);
        if (value === '') return '';
        if (hour < 1) return '1';
        if (hour > 12) return '12';
        return numericValue;
    };

    const validateMinute = (value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        const minute = parseInt(numericValue);
        if (value === '') return '';
        if (minute < 0) return '0';
        if (minute > 59) return '59';
        return numericValue;
    };

    const formatMinute = (value) => {
        if (value === '') return '';
        if (parseInt(value) < 10 && value.length === 1) return `0${value}`;
        return value;
    };

    const handleTimeChange = () => {
        const formattedStartMinute = formatMinute(startMinute);
        const formattedEndMinute = formatMinute(endMinute);
        const newStartTime = `${startHour}:${startMinute} ${startPeriod}`;
        const newEndTime = `${endHour}:${endMinute} ${endPeriod}`;
        onTimesChange(newStartTime, newEndTime);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: "white",
                borderRadius: "1.5rem",
                padding: "2rem",
                width: "90%",
                maxWidth: "40rem",
                boxShadow: "0 0.5rem 2rem rgba(0, 0, 0, 0.1)",
                position: "relative"
            }}>
                <button onClick={onClose} style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#333"
                }}>×</button>

                {/* Start Time Section */}
                <div style={{ marginBottom: "2rem" }}>
                    <h3 style={{
                        color: "#666",
                        fontSize: "1rem",
                        fontWeight: "400",
                        marginBottom: "1.5rem"
                    }}>ENTER START TIME</h3>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                                type="text"
                                value={startHour}
                                onChange={(e) => setStartHour(validateHour(e.target.value))}
                                maxLength={2}
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    border: "1px solid #ff4500",
                                    borderRadius: "0.5rem",
                                    fontSize: "1.5rem",
                                    textAlign: "center",
                                    outline: "none"
                                }}
                            />
                            <span style={{ fontSize: "1.5rem", color: "#333" }}>:</span>
                            <input
                                type="text"
                                value={startMinute}
                                onChange={(e) => setStartMinute(validateMinute(e.target.value))}
                                maxLength={2}
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    fontSize: "1.5rem",
                                    textAlign: "center",
                                    backgroundColor: "#f0f0f0",
                                    outline: "none"
                                }}
                            />
                            <div style={{ marginLeft: "1rem" }}>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button
                                        type="button"
                                        onClick={() => setStartPeriod("AM")}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            backgroundColor: startPeriod === "AM" ? "#ffd7cc" : "white",
                                            color: startPeriod === "AM" ? "#ff4500" : "#666",
                                            cursor: "pointer"
                                        }}
                                    >AM</button>
                                    <button
                                        type="button"
                                        onClick={() => setStartPeriod("PM")}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            backgroundColor: startPeriod === "PM" ? "#ffd7cc" : "white",
                                            color: startPeriod === "PM" ? "#ff4500" : "#666",
                                            cursor: "pointer"
                                        }}
                                    >PM</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* End Time Section */}
                <div>
                    <h3 style={{
                        color: "#666",
                        fontSize: "1rem",
                        fontWeight: "400",
                        marginBottom: "1.5rem"
                    }}>ENTER END TIME</h3>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                                type="text"
                                value={endHour}
                                onChange={(e) => setEndHour(validateHour(e.target.value))}
                                maxLength={2}
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    border: "1px solid #ff4500",
                                    borderRadius: "0.5rem",
                                    fontSize: "1.5rem",
                                    textAlign: "center",
                                    outline: "none"
                                }}
                            />
                            <span style={{ fontSize: "1.5rem", color: "#333" }}>:</span>
                            <input
                                type="text"
                                value={endMinute}
                                onChange={(e) => setEndMinute(validateMinute(e.target.value))}
                                maxLength={2}
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    fontSize: "1.5rem",
                                    textAlign: "center",
                                    backgroundColor: "#f0f0f0",
                                    outline: "none"
                                }}
                            />
                            <div style={{ marginLeft: "1rem" }}>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button
                                        type="button"
                                        onClick={() => setEndPeriod("AM")}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            backgroundColor: endPeriod === "AM" ? "#ffd7cc" : "white",
                                            color: endPeriod === "AM" ? "#ff4500" : "#666",
                                            cursor: "pointer"
                                        }}
                                    >AM</button>
                                    <button
                                        type="button"
                                        onClick={() => setEndPeriod("PM")}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            backgroundColor: endPeriod === "PM" ? "#ffd7cc" : "white",
                                            color: endPeriod === "PM" ? "#ff4500" : "#666",
                                            cursor: "pointer"
                                        }}
                                    >PM</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                    marginTop: "2rem"
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "0.5rem 1rem",
                            border: "none",
                            backgroundColor: "transparent",
                            color: "#ff4500",
                            cursor: "pointer",
                            fontSize: "1rem"
                        }}
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={() => {
                            handleTimeChange();
                            onClose();
                        }}
                        style={{
                            padding: "0.5rem 1rem",
                            border: "none",
                            backgroundColor: "transparent",
                            color: "#ff4500",
                            cursor: "pointer",
                            fontSize: "1rem"
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

const DateModal = ({ isOpen, onClose, startDate, endDate, onDatesChange }) => {
    return (
        isOpen && (
            <ModalOverlay
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backdropFilter: "blur(0.3vh)",
                }}
            >
                <ModalContent
                    style={{
                        position: "relative",
                        zIndex: 1001,
                        backgroundColor: "white",
                        padding: "3vh",
                        borderRadius: "2vh",
                        maxWidth: "45vw",
                        width: "100%",
                        boxShadow: "0 0.2vh 1vh rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {/* Close button */}
                    <div
                        style={{
                            position: "absolute",
                            top: "2vh",
                            right: "2vh",
                            cursor: "pointer",
                            fontSize: "2.5vh",
                            fontWeight: "bold",
                            color: "#333",
                            zIndex: 1,
                        }}
                        onClick={onClose}
                    >
                        ✕
                    </div>

                    {/* Date Selection Area */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between", // Ensure space between items
                        marginBottom: "3vh",
                    }}>
                        <div style={{flex: 1}}>
                            <label style={{
                                display: "block",
                                fontSize: "1.4vh",
                                color: "#ff6b6b",
                                marginBottom: "0.5vh"
                            }}>
                                Start Date
                            </label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => onDatesChange(date, endDate)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Start Date"
                                dateFormat="MMM dd, yyyy"
                                customInput={
                                    <input
                                        style={{
                                            width: "100%",
                                            padding: "1vh",
                                            fontSize: "1.8vh",
                                            border: "none",
                                            borderBottom: "0.1vh solid #ddd",
                                            outline: "none",
                                            backgroundColor: "#f5f5f5",
                                        }}
                                    />
                                }
                            />
                        </div>

                        <div style={{
                            marginTop: "2em",
                            marginRight: "6em",
                            color: "#ff6b6b",
                            fontSize: "1.6vh",
                            textAlign: "center",
                            width: "auto"
                        }}>
                            to
                        </div>

                        <div style={{ flex: 1 }}>
                            <label style={{
                                display: "block",
                                fontSize: "1.4vh",
                                color: "#ff6b6b",
                                marginBottom: "0.5vh"
                            }}>
                                End Date
                            </label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => onDatesChange(startDate, date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="End Date"
                                dateFormat="MMM dd, yyyy"
                                customInput={
                                    <input
                                        style={{
                                            width: "100%",
                                            padding: "1vh",
                                            fontSize: "1.8vh",
                                            border: "none",
                                            borderBottom: "0.1vh solid #ddd",
                                            outline: "none",
                                            backgroundColor: "#f5f5f5",
                                        }}
                                    />
                                }
                            />
                        </div>
                    </div>

                    <style>
                        {`
                        .react-datepicker {
                            font-family: inherit;
                            border: none;
                            box-shadow: 0 0.2vh 1vh rgba(0, 0, 0, 0.1);
                            display: inline-flex !important;
                        }

                        .react-datepicker__month-container {
                            padding: 1vh;
                        }

                        .react-datepicker__header {
                            background-color: white;
                            border-bottom: none;
                            padding-top: 1vh;
                        }

                        .react-datepicker__day {
                            width: 3vh;
                            height: 3vh;
                            line-height: 3vh;
                            margin: 0.2vh;
                            border-radius: 50%;
                        }

                        .react-datepicker__day--in-range {
                            background-color: #ffe8e8; /* Light orange for in-range */
                            color: #333;
                        }

                        .react-datepicker__day--in-selecting-range {
                            background-color: #ffe8e8; /* Light orange for selecting range */
                        }

                        .react-datepicker__day--selected,
                        .react-datepicker__day--range-start,
                        .react-datepicker__day--range-end {
                            background-color: #ff6b6b; /* Match selected color */
                            color: white;
                        }

                        .react-datepicker__day--keyboard-selected {
                            background-color: #ff6b6b; /* Match keyboard selected color */
                            color: white;
                        }

                        .react-datepicker__day:hover {
                            background-color: #ffe8e8; /* Light orange on hover */
                            color: #333;
                        }

                        .react-datepicker__navigation {
                            top: 1vh;
                        }

                        .react-datepicker__day-names {
                            margin-top: 0.5vh;
                        }

                        .react-datepicker__month {
                            margin: 0;
                        }
                        `}
                    </style>
                </ModalContent>
            </ModalOverlay>
        )
    );
};

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
    advertiserID: "67040377731df0ac20353236",
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
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };

    const toggleDateModal = () => {
        setShowDateModal(!showDateModal);
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
            !formData.name ||
            !formData.description ||
            !startDate ||
            !endDate ||
            !formData.price ||
            !formData.category ||
            imagePreviews.length === 0,
            !formData.freeSpots
        ) {
            showPopupMessage("Please fill out all required details.", true);
            return;
        }

        if (tags.length === 0 || selectedTags.length === 0) {
            showPopupMessage("Please select at least one tag.", true);
            return;
        }


        try {
            const combinedStartDate = new Date(startDate);
            const [startHours, startMinutes] = startTime.split(':').map(Number);
            combinedStartDate.setHours(startHours, startMinutes, 0);

            const combinedEndDate = new Date(endDate);
            const [endHours, endMinutes] = endTime.split(':').map(Number);
            combinedEndDate.setHours(endHours, endMinutes, 0);


            const files = imagePreviews.map((preview) => preview.file);
            const uploadedFileUrls = await uploadFiles(files, "activities");

            const finalFormData = {
                ...formData,
                startDate: combinedStartDate,
                endDate: combinedEndDate,
                pictures: uploadedFileUrls,
                tags: selectedTags,
                freeSpots: parseInt(formData.freeSpots) || 0,
                specialDiscount: parseFloat(formData.specialDiscount) || 0,
                price: parseFloat(formData.price) || 0,
                Latitude: formData.Latitude ? parseFloat(formData.Latitude) : undefined,
                Longitude: formData.Longitude ? parseFloat(formData.Longitude) : undefined
            };

            Object.keys(finalFormData).forEach(key =>
                finalFormData[key] === undefined && delete finalFormData[key]
            );

            const response = await axiosInstance.post(
                "activity/createActivity",
                finalFormData,
                {
                    withCredentials: true,
                }
            );
            console.log("Activity created:", response.data);

            showPopupMessage("Activity created successfully!", false);

            // Reset form
            setFormData(defaultData);
            setImagePreviews([]);
            setSelectedTags([]);
            setStartDate(null);
            setEndDate(null);
            setStartTime(null);
            setEndTime(null);
            setFormattedDate("");
            setFormattedTime("");
        } catch (error) {
            console.error("Error creating activity:", error);
            showPopupMessage(
                error.response?.data?.message || "Error creating activity. Please try again.",
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
            <NavBar />
            {showPopup && (
                <Popup
                    message={popupMessage}
                    onClose={() => setShowPopup(false)}
                    isError={isErrorPopup}
                />
            )}

                <form style={{marginTop: "35vh"}}>
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
                                    style={{marginLeft: "11em"}}
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
                                    style={{marginLeft: "0.8em"}}
                                />
                            </FlexGroup>
                        </FormSection>

                        <FormSection>
                            <Label>Date & Time</Label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1rem' }}>
                                <div style={{ position: 'relative', display: 'inline-block', width: '16rem' }}>
                                    <input
                                        type="text"
                                        value={formattedDate}
                                        readOnly
                                        onClick={() => setShowDateModal(true)}
                                        placeholder="Select Date"
                                        style={{
                                            fontSize: '1.125rem',
                                            width: '14vw',
                                            height: '3rem',
                                            paddingLeft: '1rem',
                                            paddingRight: '2.5rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '0.375rem',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <CalendarTodayIcon
                                        style={{
                                            position: 'absolute',
                                            right: '-1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                            fontSize: '1.2em',
                                            color: '#888',
                                        }}
                                        onClick={() => setShowDateModal(true)}
                                    />
                                </div>

                                <div style={{ marginLeft: '2vw', position: 'relative', display: 'inline-block', width: '16rem' }}>
                                    <input
                                        type="text"
                                        value={formattedTime}
                                        readOnly
                                        onClick={() => setShowTimeModal(true)}
                                        placeholder="Select Time"
                                        style={{
                                            fontSize: '1.125rem',
                                            width: '14vw',
                                            height: '3rem',
                                            paddingLeft: '1rem',
                                            paddingRight: '2.5rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '0.375rem',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <AccessTimeIcon
                                        style={{
                                            position: 'absolute',
                                            right: '-1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                            fontSize: '1.2em',
                                            color: '#888',
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
                                    style={{minWidth: "27vw"}}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category._id}
                                        </option>
                                    ))}
                                </Select>
                            </FlexGroup>

                            <FlexGroup style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "2vh",
                                minHeight: "9vh"
                            }}>
                                <Label style={{
                                    paddingTop: "1vh"
                                }}>Tags</Label>
                                <div style={{flex: 1}}>
                                    <div style={{display: "flex", gap: "1vh"}}>
                                        <Select
                                            value={selectedTag}
                                            onChange={(e) => setSelectedTag(e.target.value)}
                                            style={{
                                                minWidth: "27vw",
                                                marginLeft: "1.7vw",
                                                padding: "1vh 1.5vh",
                                                borderRadius: "0.5vh",
                                                border: "0.1vh solid #ccc"
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
                                                cursor: selectedTag ? "pointer" : "not-allowed",
                                                opacity: selectedTag ? 1 : 0.6,
                                                transition: "background-color 0.2s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = "#edbdaa";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = "#f4cfbf";
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <TagContainer style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "1vh",
                                        marginTop: "1.5vh",
                                        marginLeft: "1.7vw",
                                    }}>
                                        {selectedTags.map((tag, index) => (
                                            <Tag
                                                key={index}
                                                onClick={(e) => removeTag(tag, e)}
                                                style={{
                                                    padding: "0.5vh 1vh",
                                                    backgroundColor: "#f4cfbf",
                                                    borderRadius: "0.5vh",
                                                    cursor: "pointer"
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


                        <FormSection style={{height: "41vh"}}>
                            <Label style={{marginLeft: "2em"}}>
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
                                        display: 'flex',
                                        borderRadius: '3em',
                                        overflow: 'hidden',
                                        backgroundColor: '#eaeaea',
                                        padding: '0.2em',
                                    }}
                                >
                                    <div
                                        onClick={() => handleInputChange({
                                            target: {
                                                name: 'isOpenForBooking',
                                                value: true
                                            }
                                        })}
                                        style={{
                                            padding: '0.5em 1em',
                                            cursor: 'pointer',
                                            fontSize: '1em',
                                            fontWeight: '500',
                                            color: formData.isOpenForBooking ? '#a83232' : '#333',
                                            backgroundColor: formData.isOpenForBooking ? '#fcd8d8' : 'transparent',
                                            borderRadius: '3em',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        Open
                                    </div>
                                    <div
                                        onClick={() => handleInputChange({
                                            target: {
                                                name: 'isOpenForBooking',
                                                value: false
                                            }
                                        })}
                                        style={{
                                            padding: '0.5em 1em',
                                            cursor: 'pointer',
                                            fontSize: '1em',
                                            fontWeight: '500',
                                            color: !formData.isOpenForBooking ? '#a83232' : '#333',
                                            backgroundColor: !formData.isOpenForBooking ? '#fcd8d8' : 'transparent', // Matching background color
                                            borderRadius: '1em',
                                            transition: 'all 0.3s ease',
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
                                        onChange={(e) => setFormData({ ...formData, freeSpots: parseInt(e.target.value, 10) || 0 })}
                                        style={{
                                            width: '3em',
                                            textAlign: 'center',
                                            fontSize: '1.2em',
                                            fontWeight: 'bold',
                                            border: 'none',
                                            outline: 'none',
                                            backgroundColor: 'transparent'
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
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ButtonGroup>
                        <Button
                            stylingMode="2"
                            text="Cancel"
                            handleClick={() => {
                                setFormData(defaultData);
                                setImagePreviews([]);
                                setSelectedTags([]);
                            }}
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

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 30vw;
    min-height: 15vh;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const DateInput = styled.input`
    flex: 1;
    padding: 0.75em;
    border: 1px solid #e0e0e0;
    border-radius: 0.5em;
    margin-right: 0.5em;

    &::placeholder {
        color: #9e9e9e;
    }
`;

const DateIcon = styled.span`
    cursor: pointer;
    font-size: 1.5em;
`;

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

const TagItem = styled.label`
    background-color: ${(props) => (props.checked ? "#f28b82" : "#f5f5f5")};
    color: ${(props) => (props.checked ? "#fff" : "#757575")};
    padding: 0.5em 1em;
    border-radius: 20px;
    font-size: 0.9em;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${(props) => (props.checked ? "#d77d7d" : "#e0e0e0")};
    }
`;

const ToggleSwitch = styled.div`
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 2em;
`;

const ToggleInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .toggle-label {
        background-color: #f28b82;

        &:before {
            transform: translateX(1.5em);
        }
    }
`;

const ToggleLabel = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 2em;
    transition: background-color 0.2s;

    &:before {
        content: "";
        position: absolute;
        width: 1.5em;
        height: 1.5em;
        left: 0.25em;
        bottom: 0.25em;
        background-color: white;
        border-radius: 50%;
        transition: transform 0.2s;
    }
`;

const ActivityPhotoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 1.5em;
`;

const ActivityPhoto = styled.img`
    max-width: 100%;
    max-height: 100%;
`;

const ChooseFileButton = styled.button`
    background-color: #f28b82;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.75em 1.5em;
    font-size: 0.9em;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #d77d7d;
    }
`;

const MapContainer = styled.div`
    width: 100%;
    height: 300px;
    background-color: #f5f5f5;
    border-radius: 8px;
`;

const BookingStatusContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2em;
`;

const BookingStatus = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5em;
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

const OpenStatus = styled.div`
    color: #4caf50;
`;

const ClosedStatus = styled.div`
    color: #f44336;
`;

const CapacityStatus = styled.div`
    font-weight: bold;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1em;
    margin-top: 2em;
`;

const CancelButton = styled(Button)`
    stylingmode: "2";
    text: "Cancel";
    width: "auto";
`;

const CreateButton = styled(Button)`
    stylingmode: "1";
    text: "Create Activity";
    width: "auto";
`;

const DescriptionInput = styled.textarea`
    width: 100%;
    padding: 0.75em;
    border: 0.0625em solid #e0e0e0;
    border-radius: 0.5em;
    font-size: 1em;
    resize: none;
    min-height: 100px; /* Adjust as needed */
    &::placeholder {
        color: #9e9e9e;
    }
`;

const ActivityPhotoSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5em;
`;

const ActivityPhotoLabel = styled(Label)`
    margin-bottom: 0.5em;
`;

const DateTimeContainer = styled.div`
    display: flex;
    gap: 1em;
    margin-bottom: 1.5em;
`;

const DatePickerSection = styled.div`
    flex: 1;
`;

const TimePickerSection = styled.div`
    flex: 1;
`;

const CategorySection = styled.div`
    margin-bottom: 1.5em;
`;

const SelectedTagsSection = styled.div`
    margin-bottom: 1.5em;
`;

const TagDisplay = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
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

const CapacityDisplay = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1em;
`;

const CapacityLabel = styled.span`
    font-size: 1em;
    font-weight: 500;
`;

const CapacityNumber = styled.span`
    font-size: 1.2em;
    font-weight: bold;
    color: #4caf50; /* Change color based on availability */
`;

const BookingStatusDisplay = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1em;
`;

const BookingLabel = styled.span`
    font-size: 1em;
    font-weight: 500;
`;

const StockDisplay = styled.span`
    font-size: 1.2em;
    font-weight: bold;
    color: #333;
    min-width: 2em;
    text-align: center;
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
