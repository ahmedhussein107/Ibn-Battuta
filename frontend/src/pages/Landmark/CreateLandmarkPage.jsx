import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LocationAdder from "../../components/LocationAdder";
import { TimePicker } from "antd";
import MapPopUp from "../../components/MapPopUp";
import axiosInstance from "../../api/axiosInstance";
import { uploadFile } from "../../api/firebase";
import Footer from "../../components/Footer";
import landmarkbackground from "../../assets/backgrounds/landmarksBackground.png";
import { useNavigate } from "react-router-dom";
const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    min-height: 100vh; /* Full viewport height */
    padding: 0;
    position: relative;
    width: 100vw; /* Full viewport width */
    top: 0;
    left: 0;
`;

const FormTitle = styled.h2`
    text-align: center;
    color: var(--accent-color);
`;
const ImageList = styled.ul`
    margin-top: 10px;
    list-style: none;
    padding: 0;
    max-height: 150px;
    overflow-y: auto;
`;

const ImageItem = styled.li`
    background: #e8f5e9;
    padding: 8px;
    border: 1px solid #4caf50;
    border-radius: 4px;
    margin-bottom: 5px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const RemoveButton = styled.button`
    background: transparent;
    border: none;
    color: #d32f2f;
    cursor: pointer;
    font-size: 12px;

    &:hover {
        text-decoration: underline;
    }
`;
const InfoBoxesContainer = styled.div`
    margintop: 20px;
    display: flex;
    gap: 20px;
    flex-direction: row;
    align-items: stretch; // Ensures all child elements have the same height
    align-content: stretch; // Ensures all child elements have the same height
    width: 100%; // Set the desired width here
`;
const FormGroup = styled.div`
    display: flex; // Flex layout for horizontal arrangement
    flex-direction: column;
    flex: 1; // Allows it to grow or shrink proportionally
    background: white;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    padding: 20px;
    display: flex;
`;
const ColumnContainter = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 15px;
`;

const Button = styled.button`
    width: 10%;
    padding: 10px;
    background: white; /* Set background color to white */
    color: var(--accent-color); /* Set text color to brown */
    border: 2px solid var(--accent-color); /* Set border to brown */
    border-radius: 50px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 7vh;

    &:hover {
        transform: scale(1.1);
    }
`;

const Button1 = styled.button`
    width: 10%;
    padding: 10px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 7vh;
    background-color: var(--accent-color);

    &:hover {
        transform: scale(1.1);
    }
`;

const ImageDropzone = styled.div`
    border: 2px dashed #4caf50;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    color: #4caf50;
    background: #e8f5e9;
    border-radius: 8px;
    position: relative;
`;

const FileInput = styled.input`
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
`;

const TicketRow = styled.div`
    justify-content: space-between;
`;

const DayRow = styled(Row)`
    margin-top: 10px;
    align-items: center;
    display: flex;
    justify-content: flex-start;
    display: flex;
    flex-direction: flex-end;
`;

const TimeSelect = styled(TimePicker)`
    width: 150px;
`;

export default function LandmarkForm() {
    const navigate = useNavigate();
    const [landmark, setLandmark] = useState({
        name: "",
        description: "",
        pictures: [],
        location: "",
        ticketPrices: { foreigner: 0, native: 0, student: 0 },
        openingHours: {
            Monday: { open: null, close: null },
            Tuesday: { open: null, close: null },
            Wednesday: { open: null, close: null },
            Thursday: { open: null, close: null },
            Friday: { open: null, close: null },
            Saturday: { open: null, close: null },
            Sunday: { open: null, close: null },
        },
    });

    const [pickupLocation, setPickupLocation] = useState({
        latitude: 0,
        longitude: 0,
        location: "",
    });

    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [predefinedTags, setPredefinedTags] = useState([]);

    useEffect(() => {
        const fetchPredefinedTags = async () => {
            try {
                const response = await axiosInstance.get(
                    `/landmarkTag/allLandmarkTags/`
                );
                console.log(response);
                let tags = [];
                for (let tag of response.data) {
                    tags.push(tag._id);
                }
                setPredefinedTags(tags);
            } catch (error) {
                console.error("Error fetching Tags:", error);
            }
        };
        fetchPredefinedTags();
    }, []);

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [mapFunction, setMapFunction] = useState(null);
    useEffect(() => {
        console.log(mapFunction);
        if (mapFunction) setIsMapOpen(true);
    }, [mapFunction]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLandmark({ ...landmark, [name]: value });
    };

    const handleTicketPriceChange = (e, type) => {
        const { value } = e.target;
        setLandmark({
            ...landmark,
            ticketPrices: { ...landmark.ticketPrices, [type]: value },
        });
    };

    const handleTimeChange = (day, type, time) => {
        setLandmark({
            ...landmark,
            openingHours: {
                ...landmark.openingHours,
                [day]: { ...landmark.openingHours[day], [type]: time },
            },
        });
    };

    const handleImageDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setLandmark({
            ...landmark,
            pictures: [...landmark.pictures, ...files],
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setLandmark({
            ...landmark,
            pictures: [...landmark.pictures, ...files],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(landmark);
            let _landmark = { ...landmark, locatoin: pickupLocation.location };
            const uploadedPictures = [];
            for (const file of landmark.pictures) {
                const uploadedPath = await uploadFile(file, "yapath");
                uploadedPictures.push(uploadedPath);
            }
            _landmark = { ..._landmark, pictures: uploadedPictures };
            axiosInstance.post("/landmark/createLandmark", _landmark, {
                withCredentials: true,
            });
            navigate("/governor/landmarks");
        } catch (err) {}
    };

    const addTag = () => {
        if (selectedTag && !tags.includes(selectedTag)) {
            setTags([...tags, selectedTag]);
            setSelectedTag("");
        }
    };
    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <FormWrapper>
            <div
                style={{
                    width: "100vw",
                    height: "35vh",
                    color: "#FAE2B6",
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${landmarkbackground})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                <div style={{ marginLeft: "5%", marginBottom: "2%" }}>
                    <p
                        style={{
                            fontSize: "2.5rem",
                            marginBottom: "1rem",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                            color: "white",
                            fontWeight: "500",
                            userSelect: "none",
                        }}
                    >
                        Create a new landmark
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                style={{
                    width: "80%",
                    margin: "0 auto",
                    marginTop: "5%",
                    flexDirection: "row",
                }}
            >
                <InfoBoxesContainer>
                    <FormGroup>
                        <Label>Landmark Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={landmark.name}
                            onChange={handleInputChange}
                            required
                            style={{ width: "70%" }} // Adjust width here
                        />
                        <Label>Description</Label>
                        <Input
                            type="text"
                            name="description"
                            value={landmark.description}
                            onChange={handleInputChange}
                            style={{ width: "70%" }} // Adjust width here
                        />

                        {Object.keys(landmark.openingHours).map((day) => (
                            <DayRow key={day}>
                                <Label>{day}</Label>
                                <TimeSelect
                                    value={landmark.openingHours[day].open}
                                    onChange={(time) =>
                                        handleTimeChange(day, "open", time)
                                    }
                                    placeholder="Open"
                                    format="HH:mm"
                                />
                                <TimeSelect
                                    value={landmark.openingHours[day].close}
                                    onChange={(time) =>
                                        handleTimeChange(day, "close", time)
                                    }
                                    placeholder="Close"
                                    format="HH:mm"
                                />
                            </DayRow>
                        ))}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            {/* add map adder here */}
                            {isMapOpen && (
                                <MapPopUp
                                    popUpOpen={isMapOpen}
                                    setPopUpOpen={setIsMapOpen}
                                    mapFunction={mapFunction}
                                />
                            )}
                            <div
                                style={{
                                    width: "30%",
                                    marginTop: "30px",
                                    marginRight: "10%",
                                }}
                            >
                                <LocationAdder
                                    title="Pickup Location"
                                    styles={{ width: "100%" }}
                                    location={pickupLocation}
                                    setLocation={setPickupLocation}
                                    setMapFunction={setMapFunction}
                                />
                            </div>
                        </div>
                        <div style={{ flex: "1" }}>
                            <Label>Tags</Label>
                            <div style={{ display: "flex", width: "35%" }}>
                                <select
                                    value={selectedTag}
                                    onChange={(e) =>
                                        setSelectedTag(e.target.value)
                                    }
                                    style={{
                                        flex: 1,
                                        padding: "1vh",
                                        marginLeft: "1vh",
                                        backgroundColor: "white", // White background
                                        border: "1px solid lightgray", // Light gray border
                                        borderRadius: "01px", // Rounded rectangle shape
                                        color: "black", // Text color
                                        fontSize: "1rem", // Adjust font size for readability
                                        outline: "none", // Remove focus outline
                                        boxShadow:
                                            "0 1px 3px rgba(0, 0, 0, 0.1)", // Subtle shadow
                                    }}
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
                                    style={{
                                        marginLeft: "1vh",
                                        padding: "1vh",
                                        backgroundColor: "#f4e1c1", // Matching color as the Add Tag button
                                        border: "2px solid black",
                                        borderRadius: "40px",
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                            <div
                                style={{
                                    marginTop: "1vh",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    marginLeft: "1vh",
                                    gap: "1vh",
                                }}
                            >
                                {tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            padding: "0.5vh 1vh",
                                            backgroundColor: "#f4e1c1", // Same color as Add Tag button
                                            borderRadius: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span style={{ marginRight: "5px" }}>
                                            {tag}
                                        </span>
                                        <span
                                            onClick={() => removeTag(tag)}
                                            style={{
                                                color: "#d32f2f",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                            }}
                                        >
                                            ✕
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </FormGroup>
                    <ColumnContainter>
                        <FormGroup>
                            <Label>Pictures</Label>
                            <ImageDropzone
                                onDrop={handleImageDrop}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                Drag & Drop Images Here or Click to Select
                                <FileInput
                                    type="file"
                                    multiple
                                    onChange={handleImageChange}
                                />
                            </ImageDropzone>
                            <ImageList>
                                {landmark.pictures.map((file, index) => (
                                    <ImageItem key={index}>
                                        {file.name || file}{" "}
                                        {/* Use file name if available */}
                                        <RemoveButton
                                            onClick={() => {
                                                const updatedPictures = [
                                                    ...landmark.pictures,
                                                ];
                                                updatedPictures.splice(
                                                    index,
                                                    1
                                                );
                                                setLandmark({
                                                    ...landmark,
                                                    pictures: updatedPictures,
                                                });
                                            }}
                                        >
                                            Remove
                                        </RemoveButton>
                                    </ImageItem>
                                ))}
                            </ImageList>
                        </FormGroup>
                        <FormGroup>
                            <TicketRow>
                                {["foreigner", "native", "student"].map(
                                    (type) => (
                                        <div key={type}>
                                            <Label>
                                                {type[0].toUpperCase() +
                                                    type.slice(1)}{" "}
                                                Ticket Price
                                            </Label>
                                            <Input
                                                type="number"
                                                value={
                                                    landmark.ticketPrices[type]
                                                }
                                                onChange={(e) =>
                                                    handleTicketPriceChange(
                                                        e,
                                                        type
                                                    )
                                                }
                                                style={{
                                                    width: "80%",
                                                    height: "5%",
                                                    marginBottom: "10px",
                                                }} // Adjust width and height as needed
                                            />
                                        </div>
                                    )
                                )}
                            </TicketRow>
                        </FormGroup>
                    </ColumnContainter>
                </InfoBoxesContainer>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        stylingMode="always-light"
                        text="Cancel"
                        onClick={() => navigate("/governor/landmarks")}
                        width="auto"
                        style={{ marginRight: "75%" }} // Add right margin to the first button
                    >
                        Cancel
                    </Button>
                    <Button1 type="submit">Submit</Button1>
                </div>
            </form>

            <Footer />
        </FormWrapper>
    );
}
