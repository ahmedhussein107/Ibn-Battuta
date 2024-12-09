import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	Grid,
	TextField,
	Typography,
	Card,
	CardMedia,
	CardContent,
} from "@mui/material";
import axiosInstance from "../../api/axiosInstance";

const CreateLandmarkPage = ({ existingLandmark, onSave }) => {
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

	useEffect(() => {
		if (existingLandmark) {
			setLandmark(existingLandmark);
		}
	}, [existingLandmark]);

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
					[timeType]: value,
				},
			},
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (existingLandmark) {
				await axiosInstance.put(
					`/landmark/updateLandmark/${existingLandmark.id}`,
					landmark
				);
				setResponse("Landmark updated successfully!");
			} else {
				await axiosInstance.post("/landmark/createLandmark", landmark);
				setResponse("Landmark created successfully!");
			}
			onSave?.();
		} catch (error) {
			setResponse("Operation failed!");
			console.error(error);
		}
	};

	return (
		<Box sx={{ padding: "2rem" }}>
			<Typography variant="h4" align="center" gutterBottom>
				{existingLandmark ? "Edit Landmark" : "Create Landmark"}
			</Typography>

			<Grid container spacing={3}>
				{/* Left Section: Image and Basic Info */}
				<Grid item xs={12} md={4}>
					<Card>
						<CardMedia
							component="img"
							height="200"
							image={landmark.pictures[0] || "https://via.placeholder.com/400"}
							alt="Landmark Image"
						/>
						<CardContent>
							<TextField
								fullWidth
								label="Image URLs (comma separated)"
								name="pictures"
								value={landmark.pictures.join(", ")}
								onChange={handleChange}
								multiline
							/>
						</CardContent>
					</Card>
				</Grid>

				{/* Right Section: Form */}
				<Grid item xs={12} md={8}>
					<Box component="form" onSubmit={handleSubmit} sx={{ gap: 2 }}>
						<TextField
							fullWidth
							label="Name"
							name="name"
							value={landmark.name}
							onChange={handleChange}
							required
						/>
						<TextField
							fullWidth
							label="Description"
							name="description"
							value={landmark.description}
							onChange={handleChange}
						/>
						<TextField
							fullWidth
							label="Location"
							name="location"
							value={landmark.location}
							onChange={handleChange}
						/>
						<TextField
							fullWidth
							label="Tags (comma separated)"
							name="tags"
							value={landmark.tags.join(", ")}
							onChange={handleChange}
						/>

						<Typography variant="h6" sx={{ mt: 2 }}>
							Ticket Prices
						</Typography>
						<Grid container spacing={2}>
							<Grid item xs={4}>
								<TextField
									fullWidth
									label="Foreigner"
									name="ticketPrices.foreigner"
									type="number"
									value={landmark.ticketPrices.foreigner}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									fullWidth
									label="Native"
									name="ticketPrices.native"
									type="number"
									value={landmark.ticketPrices.native}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									fullWidth
									label="Student"
									name="ticketPrices.student"
									type="number"
									value={landmark.ticketPrices.student}
									onChange={handleChange}
								/>
							</Grid>
						</Grid>

						<Typography variant="h6" sx={{ mt: 2 }}>
							Opening Hours
						</Typography>
						{Object.keys(landmark.openingHours).map((day) => (
							<Box key={day} sx={{ display: "flex", gap: 2, mb: 1 }}>
								<TextField
									label={`${day} Open`}
									name={`openingHours.${day}.open`}
									type="time"
									value={landmark.openingHours[day].open}
									onChange={(e) => handleTimeChange(day, "open", e.target.value)}
								/>
								<TextField
									label={`${day} Close`}
									name={`openingHours.${day}.close`}
									type="time"
									value={landmark.openingHours[day].close}
									onChange={(e) => handleTimeChange(day, "close", e.target.value)}
								/>
							</Box>
						))}

						<Button variant="contained" type="submit" sx={{ mt: 2 }}>
							{existingLandmark ? "Update" : "Create"}
						</Button>
						{response && <Typography>{response}</Typography>}
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default CreateLandmarkPage;
