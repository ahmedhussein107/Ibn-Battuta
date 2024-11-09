import React, { useState } from "react";
import Button from "./Button";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import { Rating } from "@mui/material";
import { FaMapMarkerAlt, FaCalendarAlt, FaLanguage, FaTags } from "react-icons/fa";

const CardBooking = ({ booking, width, height, fontSize = "1.5rem" }) => {
	const [rating, setRating] = useState(booking.rating || 0); // Assuming rating is part of booking

	const Picture = booking.typeId.picture || "";

	// Elements for above the line (title, date)
	const aboveLine = (
		<div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					gap: "0.2rem",
				}}
			>
				<h2 style={{ fontSize: fontSize, margin: 0 }}>{booking.typeId.name}</h2>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						fontSize: "0.8rem",
						color: "#777",
						marginRight: "1rem",
					}}
				>
					<FaCalendarAlt style={{ marginRight: "0.3rem" }} />
					{new Date(booking.createdAt).toLocaleString("en-US", {
						day: "numeric",
						month: "short",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
						hour12: true,
					})}
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					gap: "0.2rem",
					marginRight: "1rem",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", color: "#777" }}>
					<FaMapMarkerAlt style={{ marginRight: "0.5rem" }} />
					{booking.typeId.location}
				</div>
				<div style={{ display: "flex", alignItems: "center", color: "#777" }}>
					{booking.bookingType == "Itinerary" ? (
						<FaLanguage style={{ marginRight: "0.5rem" }} />
					) : (
						<FaTags style={{ marginRight: "0.5rem" }} />
					)}
					{booking.bookingType == "Itinerary"
						? booking.typeId.language
						: booking.typeId.category}
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						color: "#777",
					}}
				>
					<FaTags style={{ marginRight: "0.5rem" }} />
					{booking.typeId.tags.join(", ")}
				</div>
			</div>
		</div>
	);

	// Elements for the bottom left section (location, language, tags, price, etc.)
	const bottomLeft = (
		<div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
			<div style={{ fontWeight: "bold" }}>Total Price: {booking.price} EGP</div>
			<div>Tickets: {booking.tickets}</div>
			<Rating
				name="rating"
				value={rating}
				onChange={(event, newValue) => setRating(newValue)}
			/>
		</div>
	);

	// Elements for the bottom right section (cancel/view buttons)
	const bottomRight = (
		<div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
			<Button stylingMode="1" text="view" customStyle={{ padding: "1rem" }} />
		</div>
	);

	return (
		<GenericCard
			image={Picture}
			aboveLine={aboveLine}
			bottomLeft={bottomLeft}
			bottomRight={bottomRight}
			width="46vw"
			height="26vh"
			upperHeight="40%"
			lowerHeight="58%"
		/>
	);
};

export default CardBooking;
