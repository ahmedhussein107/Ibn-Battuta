import React, { useEffect, useState } from "react";
import i2 from "../../assets/images/i2.png";
import i1 from "../../assets/images/iti.png";
import NavBar from "../../components/NavBar";
import { Avatar, Button } from "@mui/material";
import { orange } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";
import Footer from "../../components/Footer";
import AddIcon from "@mui/icons-material/Add";
import SwapVert from "@mui/icons-material/SwapVert";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import CardItinerary from "../../components/CardItinerary";
import travellerBackground from "../../assets/backgrounds/travellerBackground.png";
import DeleteButton from "../../components/DeleteButton";

const MyItineraries = () => {
	const navigate = useNavigate();

	const [itineraries, setitineraries] = useState([]);
	const [searchedTerm, setSearchedTerm] = useState("");
	const [sortBy, setSortBy] = useState("Newest");

	const sortItineraries = (itineraries) => {
		console.log("Sort By", sortBy);
		let sortedItineraries = [...itineraries]; // Create a shallow copy
		if (sortBy === "Newest") {
			sortedItineraries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		} else if (sortBy === "Oldest") {
			sortedItineraries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
		}
		console.log("sortedItineraries", sortedItineraries);
		setitineraries(sortedItineraries);
	};

	const fetchData = async (query) => {
		try {
			const response = await axiosInstance.get(`/itinerary/getTourGuideItinerary`, {
				params: query,
				withCredentials: true,
			});
			const data = response.data;
			sortItineraries(data);
			console.log("response sata is", data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const buildQuery = () => {
		const query = {};

		if (searchedTerm) {
			query.name = "~" + searchedTerm;
		}

		return query;
	};

	useEffect(() => {
		const query = buildQuery();
		fetchData(query);
	}, [searchedTerm]);

	useEffect(() => {
		sortItineraries(itineraries);
	}, [sortBy]);

	const deleteItineraryHandler = async (itineraryID) => {
		try {
			const response = await axiosInstance.delete(
				`/itinerary/deleteItinerary/${itineraryID}`
			);
			setitineraries((prevItineraries) =>
				prevItineraries.filter((itinerary) => itinerary._id !== itineraryID)
			);
		} catch (error) {
			alert("Error deleting itinerary");
		}
	};

	const activateItineraryHandler = async (itineraryID) => {
		try {
			console.log("1");
			const response = await axiosInstance.patch(`/itinerary/toggleActive/${itineraryID}`);
			console.log("2");
			setitineraries((prevItineraries) =>
				prevItineraries.map((itinerary) =>
					itinerary._id === itineraryID
						? { ...itinerary, isActivated: !itinerary.isActivated }
						: itinerary
				)
			);
		} catch (error) {
			// see error message
			console.log(error);
		}
	};

	return (
		<div style={{ position: "absolute", left: 0, top: 0 }}>
			<div>
				<img
					src={i1}
					style={{
						width: "100vw",
						height: "35vh",
						pointerEvents: "none",
						zIndex: -1,
					}}
				/>
				<img
					src={i2}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100vw",
						height: "35vh",
						pointerEvents: "none",
						zIndex: 0, // This will place the second image on top of the first
					}}
				/>

				<div
					style={{
						position: "absolute",
						top: "18vh",
						left: "45vw",
						fontSize: "3.2vh",
						fontWeight: "bold",
						color: "White",
						pointerEvents: "none",
						// this is to prevent the text from being highlighted when clicked
					}}
				>
					My Itinenraries
				</div>

				<div
					style={{
						position: "absolute",
						top: "24vh",
						left: "41vw",
						display: "flex",
						alignItems: "center",
					}}
				>
					<div>
						<input
							type="text"
							placeholder="Search for an Itinenrary"
							value={searchedTerm}
							onChange={(e) => setSearchedTerm(e.target.value)}
							style={{
								borderRadius: "4vh",
								minWidth: "18vw",
								minHeight: "3vh",
								backgroundColor: "white",
								outline: "none",
								padding: ".8vh 1.7vh",
								fontSize: "1.8vh",
							}}
						/>
						<Avatar
							sx={{
								position: "absolute",
								width: "2.7vw",
								height: "4.8vh",
								marginLeft: "17.7vw",
								marginTop: "-4.82vh",
								bgcolor: orange[700],
							}}
						>
							<SearchIcon />
						</Avatar>
					</div>

					<div />
				</div>
				<Button
					style={{
						marginLeft: "2vw",
						borderRadius: "4vh",
						minWidth: "2vw",
						color: "black",
						borderColor: "black",
						maxHeight: "4.2vh",
					}}
					variant="outlined"
					onClick={() => {
						setSortBy((prev) => (prev === "Newest" ? "Oldest" : "Newest"));
					}}
				>
					<SwapVert sx={{ fontSize: "3vh" }} />
					<p style={{ marginLeft: ".3vw" }}>Sort by Date</p>
				</Button>
				<Button
					style={{
						marginLeft: "2vw",
						borderRadius: "4vh",
						minWidth: "1vw",
						color: "black",
						borderColor: "black",
						maxHeight: "4.2vh",
					}}
					variant="outlined"
					onClick={() => {
						navigate("/tourguide/create-itinerary");
					}}
				>
					<AddIcon sx={{ fontSize: "3vh" }} />
					<p style={{ marginLeft: ".3vw" }}>Create Itinenrary</p>
				</Button>
				<div
					style={{
						marginTop: "1%",
						minHeight: "50vh",
						minWidth: "100vw",
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "space-evenly",
					}}
				>
					{itineraries.map((itinerary) => (
						<div style={{ padding: "1.5vh" }}>
							<CardItinerary
								itinerary={itinerary}
								width={"45vw"}
								height={"32vh"}
								setItineraries={sortItineraries}
								firstLineButtons={[
									[
										<DeleteButton
											deleteHandler={deleteItineraryHandler}
											ID={itinerary._id}
										/>,
									],
								]}
								bottomButtons={[
									{
										text: "Edit",
										onClick: () =>
											navigate(`/tourguide/edit-itinerary/${itinerary._id}`),
										type: "always-dark",
										width: "70%",
										styles: {
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											padding: "0.5em",
										},
									},
									{
										text: itinerary.isActivated ? "Deactivate" : "Activate",
										onClick: () => activateItineraryHandler(itinerary._id),
										type: "dark-when-hovered",
										width: "70%",
										styles: {
											marginTop: "2%",
											color: itinerary.isActivated ? "red" : "green",
											borderColor: itinerary.isActivated ? "red" : "green",
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											padding: "0.5em",
										},
									},
								]}
							/>
						</div>
					))}
				</div>

				<Footer />
			</div>
		</div>
	);
};

export default MyItineraries;
