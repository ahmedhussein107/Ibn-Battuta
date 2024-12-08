import React from "react";
import LocationIcon from "@mui/icons-material/LocationOn";
import TagsIcon from "@mui/icons-material/LocalOffer";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import TruncatedText from "./TruncatedText";
import LandmarkTimes from "./LandmarkTimes";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { useCurrencyConverter } from "../hooks/currencyHooks";

const iconSize = "0.85rem";

const CardLandmark = ({ landmark, width, height, firstLineButtons = [] }) => {
	const image = landmark.pictures[0];
	const currency = Cookies.get("currency") || " EGP";
	const { isLoading, formatPrice } = useCurrencyConverter(currency);

	if (isLoading) {
		return <CircularProgress />;
	}

	const line1 = (
		<div style={{ fontSize: "1.3rem" }}>
			<TitleAndButtons title={landmark.name} buttons={firstLineButtons} />
		</div>
	);

	const line2 = (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				fontSize: "0.9rem",
				gap: "2vw",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
				<LocationIcon style={{ fontSize: iconSize }} />
				<span>{landmark.location}</span>
			</div>
			<div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
				<TagsIcon style={{ fontSize: iconSize }} />
				<span>{landmark.tags.join(", ")}</span>
			</div>
		</div>
	);

	const description = (
		<TruncatedText
			text={landmark.description || ""}
			width={"100%"}
			height={"80%"}
			fontSize={"2vh"}
		/>
	);

	const openingHours = <LandmarkTimes times={landmark.openingHours} />;

	const ticketPrices = (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				backgroundColor: "#f5f7fa",
				borderRadius: "1vw",
				padding: "3vh 2vw",
				boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
				width: "60%",
				height: "70%",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					marginBottom: "1vh",
					color: "#2c3e50",
				}}
			>
				<ConfirmationNumberIcon
					style={{
						marginRight: "1vw",
						color: "#4299e1",
						fontSize: "2vh",
					}}
				/>
				<h4
					style={{
						margin: 0,
						fontSize: "1.8vh",
						fontWeight: "600",
						userSelect: "none",
					}}
				>
					Ticket Prices
				</h4>
			</div>
			{Object.keys(landmark.ticketPrices).map((key) => (
				<div
					key={key}
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginBottom: "0.5vh",
						padding: "1vh 1vw",
						backgroundColor: "white",
						borderRadius: "0.8vw",
						boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
						userSelect: "none",
					}}
				>
					<span
						style={{
							textTransform: "capitalize",
							fontWeight: "500",
							color: "#34495e",
							fontSize: "1.5vh",
						}}
					>
						{key.toString().charAt(0).toUpperCase() + key.toString().slice(1) + " : "}
					</span>
					<span
						style={{
							fontWeight: "bold",
							color: "#9C5F11",
							fontSize: "1.5vh",
						}}
					>
						{formatPrice(landmark.ticketPrices[key])}
					</span>
				</div>
			))}
		</div>
	);

	const card = (
		<GenericCard
			image={image}
			aboveLine={[line1, line2]}
			bottomLeft={[description, openingHours]}
			bottomRight={[ticketPrices]}
			width={width}
			height={height}
		/>
	);

	return card;
};

export default CardLandmark;
