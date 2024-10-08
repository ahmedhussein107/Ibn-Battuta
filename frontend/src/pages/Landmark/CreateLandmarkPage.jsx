import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance"; // Ensure axios is set up correctly
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const CreateLandmarkPage = () => {
    const [landmark, setLandmark] = useState({
        governorID: "",
        description: "",
        pictures: [],
        location: "",
        ticketPrices: {
            foreigner: 0,
            native: 0,
            student: 0,
        },
        name: "",
        openingHours: {
            Monday: { open: "", close: "" },
            Tuesday: { open: "", close: "" },
            Wednesday: { open: "", close: "" },
            Thursday: { open: "", close: "" },
            Friday: { open: "", close: "" },
            Saturday: { open: "", close: "" },
            Sunday: { open: "", close: "" },
        },
        tags: [],
    });
    const [response, setResponse] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("ticketPrices.")) {
            const priceType = name.split(".")[1];
            setLandmark((prev) => ({
                ...prev,
                ticketPrices: {
                    ...prev.ticketPrices,
                    [priceType]: Number(value) || 0,
                },
            }));
        } else if (name === "tags") {
            const tagsArray = value.split(",").map((tag) => tag.trim());
            setLandmark((prev) => ({
                ...prev,
                tags: tagsArray,
            }));
        } else if (name === "pictures") {
            const picturesArray = value.split(",").map((url) => url.trim());
            setLandmark((prev) => ({
                ...prev,
                pictures: picturesArray,
            }));
        } else {
            setLandmark((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleTimeChange = (day, timeType, value) => {
        setLandmark((prev) => ({
            ...prev,
            openingHours: {
                ...prev.openingHours,
                [day]: {
                    ...prev.openingHours[day],
                    [timeType]: value, // Store as string for the input
                },
            },
        }));
    };

    const handleCreateClick = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(
                "/landmark/createLandmark",
                landmark
            );
            setResponse("Landmark created successfully!");
            setLandmark({
                // Reset the form after successful creation
                governorID: "",
                description: "",
                pictures: [],
                location: "",
                ticketPrices: { foreigner: 0, native: 0, student: 0 },
                name: "",
                openingHours: {
                    Monday: { open: "", close: "" },
                    Tuesday: { open: "", close: "" },
                    Wednesday: { open: "", close: "" },
                    Thursday: { open: "", close: "" },
                    Friday: { open: "", close: "" },
                    Saturday: { open: "", close: "" },
                    Sunday: { open: "", close: "" },
                },
                tags: [],
            });
        } catch (error) {
            setResponse("Landmark creation failed!");
            console.error(error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Create Landmark
            </Typography>

            <Box
                component="form"
                onSubmit={handleCreateClick}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="GovernorID"
                    name="governorID"
                    value={landmark.governorID}
                    onChange={handleChange}
                />
                <TextField
                    label="Name"
                    name="name"
                    value={landmark.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    value={landmark.description}
                    onChange={handleChange}
                />
                <TextField
                    label="Tags (comma separated)"
                    name="tags"
                    value={landmark.tags.join(", ")}
                    onChange={handleChange}
                />
                <TextField
                    label="Location"
                    name="location"
                    value={landmark.location}
                    onChange={handleChange}
                />
                <TextField
                    label="Pictures (comma separated URLs)"
                    name="pictures"
                    value={landmark.pictures.join(", ")}
                    onChange={handleChange}
                />
                <TextField
                    label="Foreign Ticket Price"
                    name="ticketPrices.foreigner"
                    type="number"
                    value={landmark.ticketPrices.foreigner}
                    onChange={handleChange}
                />
                <TextField
                    label="Native Ticket Price"
                    name="ticketPrices.native"
                    type="number"
                    value={landmark.ticketPrices.native}
                    onChange={handleChange}
                />
                <TextField
                    label="Student Ticket Price"
                    name="ticketPrices.student"
                    type="number"
                    value={landmark.ticketPrices.student}
                    onChange={handleChange}
                />

                {/* Opening Hours */}
                <Typography variant="h6" align="left">
                    Opening Hours
                </Typography>
                {Object.keys(landmark.openingHours).map((day) => (
                    <Box key={day} sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            label={`${day} Open`}
                            name={`openingHours.${day}.open`}
                            type="time"
                            value={landmark.openingHours[day].open}
                            onChange={(e) =>
                                handleTimeChange(day, "open", e.target.value)
                            }
                        />
                        <TextField
                            label={`${day} Close`}
                            name={`openingHours.${day}.close`}
                            type="time"
                            value={landmark.openingHours[day].close}
                            onChange={(e) =>
                                handleTimeChange(day, "close", e.target.value)
                            }
                        />
                    </Box>
                ))}

                <Button variant="contained" type="submit">
                    Create Landmark
                </Button>
            </Box>
            {response && <p>{response}</p>}
        </Container>
    );
};

export default CreateLandmarkPage;
