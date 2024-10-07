import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance"; // Ensure you have this set up
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const LandmarkPage = () => {
    const landmarkId = "670423acab34585391f6b3e9";
    const [landmark, setLandmark] = useState(null);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLandmark = async () => {
            try {
                const response = await axiosInstance.get(
                    `/landmark/landmark/${landmarkId}`
                );
                setLandmark(response.data);
            } catch (error) {
                console.error("Error fetching landmark:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLandmark();
    }, [landmarkId]);

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
        } else {
            setLandmark((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleTimeChange = (day, timeType, value) => {
        // Convert the time string to a Date object
        const date = new Date();
        const [hours, minutes] = value.split(":");
        date.setHours(hours, minutes, 0, 0); // Set hours and minutes, reset seconds and milliseconds

        setLandmark((prev) => ({
            ...prev,
            openingHours: {
                ...prev.openingHours,
                [day]: {
                    ...prev.openingHours[day],
                    [timeType]: date.toISOString(), // Save as ISO string
                },
            },
        }));
    };

    const handleUpdateClick = async (e) => {
        e.preventDefault();
        try {
            const { openingHours, ...toSend } = landmark;
            const tagsArray = landmark.tags.map((tag) => tag.trim());
            toSend.tags = tagsArray;

            Object.keys(openingHours).forEach((day) => {
                Object.keys(openingHours[day]).forEach((timeType) => {
                    openingHours[day][timeType] = new Date(
                        openingHours[day][timeType]
                    ).toISOString();
                });
            });

            const response = await axiosInstance.patch(
                `/landmark/updateLandmark/${landmarkId}`,
                {
                    ...toSend,
                    openingHours,
                }
            );
            setResponse("Landmark updated successfully!");
        } catch (error) {
            setResponse("Landmark update failed!");
            console.error(error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!landmark) return <p>Landmark not found.</p>;

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Landmark Page
            </Typography>
            <Box
                component="form"
                onSubmit={handleUpdateClick}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="GovernorID"
                    name="governorID"
                    value={landmark.governorID || ""}
                    onChange={handleChange}
                />
                <TextField
                    label="Name"
                    name="name"
                    value={landmark.name || ""}
                    onChange={handleChange}
                />
                <TextField
                    label="Description"
                    name="description"
                    value={landmark.description || ""}
                    onChange={handleChange}
                />
                <TextField
                    label="Tags"
                    name="tags"
                    value={(landmark.tags || []).join(", ") || ""}
                    onChange={handleChange}
                />
                <TextField
                    label="Location"
                    name="location"
                    value={landmark.location || ""}
                    onChange={handleChange}
                />
                <TextField
                    label="Pictures (comma separated URLs)"
                    name="pictures"
                    value={(landmark.pictures || []).join(", ") || ""}
                    onChange={(e) =>
                        handleChange({
                            target: {
                                name: "pictures",
                                value: e.target.value
                                    .split(",")
                                    .map((url) => url.trim()),
                            },
                        })
                    }
                />
                <TextField
                    label="Foreign Ticket Price"
                    name="ticketPrices.foreigner"
                    type="number"
                    value={landmark.ticketPrices.foreigner || ""}
                    onChange={handleChange}
                />
                <TextField
                    label="Native Ticket Price"
                    name="ticketPrices.native"
                    type="number"
                    value={landmark.ticketPrices.native || ""}
                    onChange={handleChange}
                />
                <TextField
                    label="Student Ticket Price"
                    name="ticketPrices.student"
                    type="number"
                    value={landmark.ticketPrices.student || ""}
                    onChange={handleChange}
                />

                {/* Opening Hours */}
                <Typography variant="h6">Opening Hours</Typography>
                {Object.keys(landmark.openingHours).map((day) => (
                    <Box key={day} sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            label={`${day} Open`}
                            name={`openingHours.${day}.open`}
                            type="time"
                            value={
                                landmark.openingHours[day]?.open
                                    ? new Date(
                                          landmark.openingHours[day].open
                                      ).toLocaleTimeString("en-GB", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : ""
                            }
                            onChange={(e) =>
                                handleTimeChange(day, "open", e.target.value)
                            }
                        />
                        <TextField
                            label={`${day} Close`}
                            name={`openingHours.${day}.close`}
                            type="time"
                            value={
                                landmark.openingHours[day]?.close
                                    ? new Date(
                                          landmark.openingHours[day].close
                                      ).toLocaleTimeString("en-GB", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : ""
                            }
                            onChange={(e) =>
                                handleTimeChange(day, "close", e.target.value)
                            }
                        />
                    </Box>
                ))}

                <Button variant="contained" type="submit">
                    Update Landmark
                </Button>
            </Box>
            {response && <p>{response}</p>}
        </Container>
    );
};

export default LandmarkPage;
