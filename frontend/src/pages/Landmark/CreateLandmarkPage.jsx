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
import PhotosUpload from "../../components/PhotosUpload.jsx";
import CurrencyDropdown from "../../components/CurrencyDropdownList.jsx";
import { useCurrencyConverter } from "../../hooks/currencyHooks.js";
import Cookies from "js-cookie";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton"; // Ensure this is imported for the close button
import CloseIcon from "@mui/icons-material/Close";
import GenericDropDown from "../../components/GenericDropDown.jsx";

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

const InfoBoxesContainer = styled.div`
	margin-top: 2px;
	flex: 1;
	display: flex;
	gap: 10px; /* Increase the gap for more spacing */
	flex-direction: row;
	align-items: stretch; /* Ensure all child elements stretch to fill height */
	justify-content: center; /* Ensure alignment */
	padding: 20px; /* Add padding around the container */
	width: 95%;
	max-width: 95%; /* Set a max width for better layout control */
	height: 100%; /* Fill the parent's height */
`;

const FormGroup = styled.div`
	display: flex; // Flex layout for horizontal arrangement
	flex-direction: column;
	flex: 1; // Allows it to grow or shrink proportionally
	background: white;
	box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
	border-radius: 20px;
	padding: 20px;
	width: 100%;
	min-height: 100; // Set a minimum height to ensure visibility and equalization
`;

const ColumnContainter = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: stretch; // Ensure child elements stretch to fill the width
	width: 40%; /* Set the desired width here */
	height: 100%; /* Set height to 100% to fill the parent container */
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
	flex: 1; /* Takes up remaining space */
	font-weight: bold;
	font-size: 1rem;
	margin-right: 10px; /* Space between label and time selects */
`;

const TimeSelect = styled(TimePicker)`
	width: 150px;
	padding: 5px 10px;
	margin-right: 10px; /* Space between time selects */
	border: 1px solid #ccc;
	border-radius: 4px;
	font-size: 1rem;
	width: 120px; /* Fixed width for time selects */
`;
const OpeningHoursSection = styled.div`
	display: flex;
	flex-direction: column;
	margin: 1px; /* Add some space around the section */
`;

const CustomAlert = ({ message, severity, open, onClose }) => {
	// Automatically close the alert after a specified duration (e.g., 3000ms)
	useEffect(() => {
		if (open) {
			const timer = setTimeout(() => {
				onClose(); // Close the alert after the duration
			}, 3000); // Duration in milliseconds

			return () => clearTimeout(timer); // Cleanup the timer when unmounting or when `open` changes
		}
	}, [open, onClose]);

	return (
		<>
			{open && ( // Render the alert only if it is open
				<div
					style={{
						position: "fixed", // Fixed position to keep it in view
						bottom: "5vh", // Distance from the bottom of the page
						right: "10vh", // Distance from the right of the page
						zIndex: 2000, // Ensure it is on top of other elements
					}}
				>
					<Collapse in={open}>
						<Alert
							severity={severity || "info"}
							action={
								<IconButton
									aria-label="close"
									color="inherit"
									size="small"
									onClick={onClose}
								>
									<CloseIcon fontSize="inherit" />
								</IconButton>
							}
							sx={{
								mb: 2,
								minHeight: "5vh", // Minimum height for better visibility
								height: "auto", // Allow height to expand
								width: "60vh", // Fixed width to prevent excessive stretching
								fontSize: "1rem", // Adjust text size as needed
								padding: "10px 15px", // Padding for content space
							}}
						>
							{message}
						</Alert>
					</Collapse>
				</div>
			)}
		</>
	);
};

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
	const [selectedCurrency, setSelectedCurrency] = useState("");
	const currency = Cookies.get("currency") || "EGP";
	const { isLoading, formatPrice, convertPrice } = useCurrencyConverter(currency);
	const [alertOpen, setAlertOpen] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertSeverity, setAlertSeverity] = useState("info");
	const showAlert = (message, severity = "info") => {
		setAlertMessage(message);
		setAlertSeverity(severity);
		setAlertOpen(true);
	};
	const handleCloseAlert = () => {
		setAlertOpen(false);
	};

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
	const handleImageAdd = (newImages) => {
		setLandmark((prev) => ({
			...prev,
			pictures: [...prev.pictures, ...newImages],
		}));
		console.log(landmark.pictures); // Log the current pictures state
	};

	const handleImageRemove = (idToRemove) => {
		setLandmark((prev) => ({
			...prev,
			pictures: prev.pictures.filter((image) => image.id !== idToRemove),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			console.log(landmark);
			let _landmark = { ...landmark, locatoin: pickupLocation.location };
			const uploadedPictures = [];
			for (const photo of landmark.pictures) {
				const uploadedPath = await uploadFile(photo.file, "landmarks");
				uploadedPictures.push(uploadedPath);
			}
			_landmark = { ..._landmark, pictures: uploadedPictures };

			await axiosInstance.post("/landmark/createLandmark", _landmark, {
				withCredentials: true,
			});

			// Show success alert before navigating
			showAlert("Landmark created successfully", "success");

			navigate("/governor/landmarks");
		} catch (err) {
			showAlert("Error submitting landmark. Please try again.", "error");
		}
	};

	const addTag = () => {
		if (selectedTag && !tags.includes(selectedTag)) {
			setTags([...tags, selectedTag]);
			setSelectedTag("");
			console.log("Selected Tags after adding:", [...tags, selectedTag]); // Log the updated tags
		}
	};

	const removeTag = (tagToRemove) => {
		setTags((prevTags) => {
			const updatedTags = prevTags.filter((tag) => tag !== tagToRemove);

			// Clear selectedTag if the removed tag is the current selectedTag
			if (selectedTag === tagToRemove) {
				setSelectedTag("");
			}

			console.log("Selected Tags after removing:", updatedTags); // Log the updated tags
			return updatedTags; // Return the updated tags array
		});
	};
	const handleTimeChange = (day, type, time) => {
		const openTime = type === "open" ? time : landmark.openingHours[day].open;
		const closeTime = type === "close" ? time : landmark.openingHours[day].close;

		// Check if the selected open time is after close time
		if (type === "open" && closeTime && time && time.isAfter(closeTime)) {
			showAlert("Open time cannot be after close time.", "error");
			return; // Exit the function if validation fails
		}

		// Check if the selected close time is before open time
		if (type === "close" && openTime && time && time.isBefore(openTime)) {
			showAlert("Close time cannot be before open time.", "error");
			return; // Exit the function if validation fails
		}

		// Update state if validation passes
		setLandmark({
			...landmark,
			openingHours: {
				...landmark.openingHours,
				[day]: { ...landmark.openingHours[day], [type]: time },
			},
		});
	};

	return (
		<FormWrapper>
			<CustomAlert
				message={alertMessage}
				severity={alertSeverity}
				open={alertOpen}
				onClose={handleCloseAlert}
			/>
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
					width: "100%", // Set to 90% to leave 5% margin on both sides
					maxWidth: "100%", // Optional maximum width
					marginTop: "1%", // Auto margin for centering with 5% margin on top and bottom
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<InfoBoxesContainer
					style={{
						width: "100%", // Full width for the info boxes
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "center",
					}}
				>
					<FormGroup
						style={{
							flex: 1, // Allow to grow
							maxWidth: "600px", // Maximum width for FormGroup
							margin: "10px", // Margin for spacing
						}}
					>
						<Row
							style={{
								display: "flex",
								flexDirection: "column",
								width: "100%",
							}}
						>
							<Label>Landmark Name</Label>
							<Input
								type="text"
								name="name"
								value={landmark.name}
								onChange={handleInputChange}
								required
								style={{ width: "93%", minWidth: "200px" }} // Full width
							/>
						</Row>
						<Row
							style={{
								display: "flex",
								flexDirection: "column",
								width: "93%",
							}}
						>
							<Label>Description</Label>
							<Input
								type="text"
								name="description"
								value={landmark.description}
								onChange={handleInputChange}
								style={{ width: "100%", minWidth: "200px" }} // Full width
							/>
						</Row>
						<OpeningHoursSection>
							{Object.keys(landmark.openingHours).map((day) => (
								<DayRow
									key={day}
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-start",
										marginBottom: "5px", // Spacing between day rows
									}}
								>
									<Label style={{ marginBottom: "0px" }}>{day}</Label>
									<div
										style={{
											display: "flex",
											gap: "1px",
											marginTop: "0px",
											width: "100%", // Ensure the container takes full width
										}}
									>
										<TimeSelect
											value={landmark.openingHours[day].open}
											onChange={(time) => handleTimeChange(day, "open", time)}
											placeholder="Open"
											format="HH:mm"
											style={{ flex: 1 }} // Allow TimeSelect components to grow
										/>
										<TimeSelect
											value={landmark.openingHours[day].close}
											onChange={(time) =>
												handleTimeChange(day, "close", time)
											}
											placeholder="Close"
											format="HH:mm"
											style={{ flex: 1 }} // Allow TimeSelect components to grow
										/>
									</div>
								</DayRow>
							))}
						</OpeningHoursSection>
						<div
							onClick={(e) => e.preventDefault()}
							style={{
								display: "flex",
								justifyContent: "space-between",
								marginTop: "15px",
							}}
						>
							{isMapOpen && (
								<MapPopUp
									popUpOpen={isMapOpen}
									setPopUpOpen={setIsMapOpen}
									mapFunction={mapFunction}
								/>
							)}
							<div
								style={{
									flex: 1, // Allow the LocationAdder to grow
									marginTop: "30px",
									marginRight: "10px",
								}}
							>
								<LocationAdder
									title="Location"
									styles={{ width: "100%" }} // Full width
									location={pickupLocation}
									setLocation={setPickupLocation}
									setMapFunction={setMapFunction}
								/>
							</div>
						</div>
						<div style={{ flex: "1" }}>
							<Label>Tags</Label>
							<div style={{ display: "flex", width: "100%" }}>
								<select
									value={selectedTag}
									onChange={(e) => setSelectedTag(e.target.value)}
									style={{
										flex: 1,
										padding: "1vh",
										marginLeft: "1vh",
										backgroundColor: "white",
										border: "1px solid lightgray",
										borderRadius: "4px",
										color: "black",
										fontSize: "1rem",
										outline: "none",
										boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
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
										style={{
											padding: "0.5vh 1vh",
											backgroundColor: "#f4e1c1",
											borderRadius: "8px",
											display: "flex",
											alignItems: "center",
										}}
									>
										<span style={{ marginRight: "5px" }}>{tag}</span>
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
							<PhotosUpload
								label="Activity Photos"
								imagePreviews={landmark.pictures}
								onImageAdd={handleImageAdd}
								onImageRemove={handleImageRemove}
							/>
						</FormGroup>

						<FormGroup>
							<Label>Ticket Prices</Label>
							<CurrencyDropdown
								selectedCurrency={selectedCurrency}
								setSelectedCurrency={setSelectedCurrency}
							/>
							<TicketRow>
								{["foreigner", "native", "student"].map((type) => (
									<div key={type}>
										<Label>
											{type[0].toUpperCase() + type.slice(1)} Ticket Price
										</Label>
										<Input
											type="number"
											value={landmark.ticketPrices[type]}
											onChange={(e) => handleTicketPriceChange(e, type)}
											style={{
												width: "80%",
												height: "5%",
												marginBottom: "10px",
											}}
										/>
									</div>
								))}
							</TicketRow>
						</FormGroup>
					</ColumnContainter>
				</InfoBoxesContainer>

				<div
					style={{
						display: "flex",
						justifyContent: "center",
						width: "100%",
					}}
				>
					<Button
						stylingMode="always-light"
						text="Cancel"
						onClick={() => navigate("/governor/landmarks")}
						width="auto"
						style={{ marginRight: "75%" }}
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
