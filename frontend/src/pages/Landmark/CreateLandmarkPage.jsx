import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LocationAdder from "../../components/LocationAdder";
import { TimePicker } from "antd";
import MapPopUp from "../../components/MapPopUp";
import axiosInstance from "../../api/axiosInstance";
import { uploadFile } from "../../api/firebase";
// Styled components
import { useNavigate } from "react-router-dom";
const FormWrapper = styled.div`
    width: 55%;
    margin: 20px auto;
    padding: 200px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
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

const FormGroup = styled.div`
    margin-bottom: 15px;
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
    width: 20%;
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

const TicketRow = styled(Row)`
    justify-content: space-between;
`;

const DayRow = styled(Row)`
    align-items: center;
    display: flex;
    flex-direction: flex-end;
    justify-content: flex-end;
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
                const response = await axiosInstance.get(`/landmarkTag/allLandmarkTags/`);
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
        setLandmark({ ...landmark, pictures: [...landmark.pictures, ...files] });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setLandmark({ ...landmark, pictures: [...landmark.pictures, ...files] });
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
            navigate(-1);
        } catch (err) {}
    };

    const addTag = () => {
        if (selectedTag && !tags.includes(selectedTag)) {
            setTags([...tags, selectedTag]);
            setSelectedTag("");
        }
    };

    return (
        <FormWrapper>
            <FormTitle>Create Landmark</FormTitle>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Landmark Name</Label>
                    <Input
                        type="text"
                        name="name"
                        value={landmark.name}
                        onChange={handleInputChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Description</Label>
                    <Input
                        type="text"
                        name="description"
                        value={landmark.description}
                        onChange={handleInputChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Pictures</Label>
                    <ImageDropzone
                        onDrop={handleImageDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        Drag & Drop Images Here or Click to Select
                        <FileInput type="file" multiple onChange={handleImageChange} />
                    </ImageDropzone>
                    <ImageList>
                        {landmark.pictures.map((file, index) => (
                            <ImageItem key={index}>
                                {file.name || file} {/* Use file name if available */}
                                <RemoveButton
                                    onClick={() => {
                                        const updatedPictures = [...landmark.pictures];
                                        updatedPictures.splice(index, 1);
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

                <TicketRow>
                    {["foreigner", "native", "student"].map((type) => (
                        <FormGroup key={type}>
                            <Label>
                                {type[0].toUpperCase() + type.slice(1)} Ticket Price
                            </Label>
                            <Input
                                type="number"
                                value={landmark.ticketPrices[type]}
                                onChange={(e) => handleTicketPriceChange(e, type)}
                            />
                        </FormGroup>
                    ))}
                </TicketRow>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
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
                    </div>
                    {/* add map adder here */}
                    {isMapOpen && (
                        <MapPopUp
                            popUpOpen={isMapOpen}
                            setPopUpOpen={setIsMapOpen}
                            mapFunction={mapFunction}
                        />
                    )}
                    <div style={{ width: "30%", marginTop: "30px", marginRight: "10%" }}>
                        <LocationAdder
                            title="Pickup Location"
                            styles={{ width: "100%" }}
                            location={pickupLocation}
                            setLocation={setPickupLocation}
                            setMapFunction={setMapFunction}
                        />
                    </div>
                </div>
                <div style={{ flex: "1", marginLeft: "5%" }}>
                    <label>Tags</label>
                    <div style={{ display: "flex", width: "35%" }}>
                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            style={{
                                flex: 1,
                                padding: "1vh",
                                marginLeft: "1vh",
                                backgroundColor: "#f4e1c1",
                                border: "2px solid black",
                                borderRadius: "40px",
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
                                backgroundColor: "#f4e1c1",
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
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </FormWrapper>
    );
}
