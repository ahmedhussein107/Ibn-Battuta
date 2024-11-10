import React, { useEffect, useState } from "react";
import Button from "./Button";
import GenericCard from "./GenericCard";
import { Avatar, Rating } from "@mui/material";
import LocationIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import TagsIcon from "@mui/icons-material/LocalOffer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PopUp from "./PopUpsGeneric/PopUp";
import axiosInstance from "../api/axiosInstance";

const CardBooking = ({ booking, width, height, fontSize = "1.5rem" }) => {
	const [rating, setRating] = useState(booking.ratingID ? booking.ratingID.rating : 0);
	const [comment, setComment] = useState(booking.ratingID ? booking.ratingID.comment : "");
	const [isReadOnly, setIsReadOnly] = useState(!!booking.ratingID);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!open && !isReadOnly) {
			setRating(0);
			setComment("");
		}
	}, [open]);

	const Picture = booking.typeId.picture || "";
	const profilePicture =
		booking.bookingType == "Itinerary"
			? booking.typeId.tourguideID.picture
			: booking.typeId.advertiserID.picture || "";
	const name =
		booking.bookingType == "Itinerary"
			? booking.typeId.tourguideID.name
			: booking.typeId.advertiserID.name || "";
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
					<CalendarTodayIcon sx={{ marginRight: "0.3rem", fontSize: "1em" }} />
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
				<div style={{ display: "flex", alignItems: "center" }}>
					<LocationIcon sx={{ marginRight: "0.5rem", fontSize: "1.1em" }} />
					{booking.typeId.location}
				</div>
				<div style={{ display: "flex", alignItems: "center" }}>
					{booking.bookingType == "Itinerary" ? (
						<LanguageIcon style={{ marginRight: "0.5rem", fontSize: "1.1em" }} />
					) : (
						<TagsIcon style={{ marginRight: "0.5rem", fontSize: "1.1em" }} />
					)}
					{booking.bookingType == "Itinerary"
						? booking.typeId.language
						: booking.typeId.category}
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<TagsIcon sx={{ marginRight: "0.5rem", fontSize: "1.1em" }} />
					{booking.typeId.tags.join(", ")}
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					padding: "1%",
				}}
			>
				<Avatar src={profilePicture} />
				{name}
			</div>
		</div>
	);

	const currentDate = new Date(Date.now());
	const date =
		booking.bookingType == "Itinerary"
			? booking.typeId.availableDatesAndTimes[0]
			: booking.typeId.startDate;
	const givenDate = new Date(date);
	const differenceInMilliseconds = givenDate - currentDate;
	const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24.0);

	const handleSubmit = async (event, newValue) => {
		try {
			const response = await axiosInstance.post(
				`/rating/rate${booking.bookingType}/${booking.typeId._id}`,
				{ rating, comment },
				{ withCredentials: true }
			);
			if (response.status === 201) {
				setIsReadOnly(true);
				console.log("Rating added successfully");
				const newBooking = await axiosInstance.patch(
					`/booking/updateBooking/${booking._id}`,
					{ ratingID: response.data.newRating._id }
				);
				if (newBooking.status === 200) {
					console.log("Rating ID added to booking successfully");
				} else {
					console.error("Failed to add rating ID to booking");
				}
			} else {
				console.error("Failed to add rating");
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setOpen(false);
		}
	};

	const bottomLeft = (
		<div style={{ display: "flex", flexDirection: "column", gap: "0.1em" }}>
			<div>Booking ID: {booking._id}</div>
			<div>Total Price: {booking.totalPrice} EGP</div>
			<div>Tickets: {booking.count}</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<div style={{ width: "60%" }}>
					{differenceInDays < 0 ? (
						<Rating
							name="rating"
							value={rating}
							onChange={(event, newValue) => {
								setRating(newValue);
								setOpen(true);
							}}
							readOnly={isReadOnly}
						/>
					) : (
						<></>
					)}
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						width: "40%",
					}}
				>
					{differenceInDays >= 2 ? (
						<Button
							stylingMode="2"
							width="50%"
							text="cancel"
							customStyle={{ padding: "0.8rem" }}
							onClick={() => {
								axiosInstance.get(`/booking/deleteBooking/${booking._id}`);
								window.location.reload();
							}}
						/>
					) : (
						<div></div>
					)}
					<Button
						stylingMode="1"
						width="50%"
						text="view"
						customStyle={{ padding: "0.8rem" }}
						onClick={() => {}} // Add onClick
					/>
				</div>
			</div>
		</div>
	);

	return (
		<div>
			<PopUp
				isOpen={open}
				setIsOpen={setOpen}
				headerText={`Rate ${booking.bookingType}`}
				handleSubmit={handleSubmit}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<div
						style={{
							width: "90%",
							display: "flex",
							justifyContent: "center",
							paddingBottom: "4%",
						}}
					>
						<Rating
							name="rating"
							value={rating}
							readOnly={isReadOnly}
							onChange={(event, newValue) => setRating(newValue)}
							style={{ fontSize: "4rem" }}
						/>
					</div>
					<div style={{ width: "90%" }}>
						<label
							style={{
								display: "block",
								marginBottom: "0.5vh",
								fontWeight: "bold",
							}}
						>
							Add your comment
						</label>
						<textarea
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder="Insert comment here..."
							style={{
								width: "100%",
								padding: "1vh",
								borderRadius: "1vh",
								resize: "vertical",
							}}
						/>
					</div>
				</div>
			</PopUp>
			<GenericCard
				image={Picture}
				aboveLine={aboveLine}
				bottomLeft={bottomLeft}
				bottomRight={<></>}
				width="46vw"
				height="26vh"
				upperHeight="44%"
				lowerHeight="54%"
				bottomLeftWidth="100%"
				bottomRightWidth="0%"
			/>
		</div>
	);
};

export default CardBooking;
