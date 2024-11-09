import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import PaginationComponent from "../../components/Pagination";
import bookingsBackground from "../../assets/backgrounds/bookingsBackground.png";
import CustomButton from "../../components/Button";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import GenericCard from "../../components/GenericCard";

const Bookings = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const itemsPerPage = 4;
	const [selected, setSelected] = useState("Itineraries");
	const [bookings, setBookings] = useState([]);

	const buttons = ["Itineraries", "Activities", "Flights", "Hotels"];

	const handlePageChange = (event, newPage) => {
		setCurrentPage(newPage);
	};

	const handleChooseType = (page) => {
		setSelected(page);
	};

	const URI = {
		Itineraries: "itinerary/getItineraries",
		Activities: "activity/getActivities",
		Flights: "flight/getFlights",
		Hotels: "hotel/getHotels",
	};

	const fetchBookings = async () => {
		try {
			const response = await axiosInstance.get(URI[selected], { withCredientials: true });
			setBookings(response.data);
		} catch (error) {
			console.error("Failed to fetch bookings", error);
		}
	};

	useEffect(() => {
		// fetchBookings();
	}, [selected]);

	return (
		<div style={{ width: "100vw", position: "absolute", top: "0", left: "0" }}>
			<NavBar />
			<div style={backgroundStyle}>
				<h1 style={headerStyle}>My Bookings</h1>
			</div>
			<div style={{ padding: "1%" }}>
				<div style={buttonGroupStyle}>
					{buttons.map((button) => (
						<button
							key={button}
							onClick={() => handleChooseType(button)}
							style={selected === button ? selectedButtonStyle : buttonStyle}
						>
							{button}
						</button>
					))}
				</div>
				<div style={{}}>
					{selected == "Itineraries" && (
						<div>
							<GenericCard width={"40%"} />
						</div>
					)}
					{selected == "Activities" && <div> </div>}
					{selected == "Flights" && <div> </div>}
					{selected == "Hotels" && <div> </div>}
				</div>
				<PaginationComponent
					totalPages={totalPages}
					currentPage={currentPage}
					onChange={handlePageChange}
				/>
			</div>
			<Footer />
		</div>
	);
};

const backgroundStyle = {
	width: "100vw",
	height: "30vh",
	backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bookingsBackground})`,
	backgroundSize: "100% 100%",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	shadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
};

const headerStyle = {
	position: "relative",
	fontSize: "2rem",
	fontWeight: "bold",
	marginTop: "5%",
	color: "White",
};

const buttonGroupStyle = {
	display: "flex",
	gap: "10px",
};

const buttonStyle = {
	padding: "10px 20px",
	border: "2px solid #000",
	borderRadius: "20px",
	backgroundColor: "transparent",
	color: "#000",
	cursor: "pointer",
	transition: "background-color 0.3s ease, color 0.3s ease",
};

const selectedButtonStyle = {
	...buttonStyle,
	backgroundColor: "#FF5722",
	color: "#fff",
};

export default Bookings;
