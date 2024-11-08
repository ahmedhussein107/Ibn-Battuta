import React, { useState } from "react";
import LocationIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import TagsIcon from "@mui/icons-material/LocalOffer";
import Button from "./Button";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import TruncatedText from "./TruncatedText";
import { Rating } from "@mui/material";

const CardProduct = ({ product, width, height, firstLineButtons }) => {
	const image = product.pictures[0];
	const line1 = <TitleAndButtons title={product.name} buttons={firstLineButtons} />;
	const line2 = (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				gap: "3vw",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
				<LocationIcon style={{ fontSize: "2vh" }} />
				<span>{product.location}</span>
			</div>
			<div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
				<LanguageIcon style={{ fontSize: "2vh" }} />
				<span>{product.language}</span>
			</div>
		</div>
	);

	const description = (
		<TruncatedText
			text={product.description}
			width={"100%"}
			height={"80%"}
			fontSize={"2vh"}
		/>
	);
	const rating = Math.floor(product.rating);
	console.log("rating", rating);
	const ratings = (
		<div style={{ display: "flex", flexDirection: "row", marginTop: "-2%" }}>
			<Rating name="read-only" value={rating} readOnly />
			<p style={{ marginLeft: "5%", marginTop: "0%" }}>{product.ratings.length}</p>
		</div>
	);
	const availableProducts = (
		<p
			style={{
				marginTop: "-4%",
				color: "brown",
				fontSize: "1.6vh",
			}}
		>
			{product.quantity} in stock
		</p>
	);
	const price = (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				fontWeight: "bold",
				// marginTop: "-15%",
			}}
		>
			<p>USD</p>
			<p style={{ marginLeft: "5%" }}>{product.price}</p>
		</div>
	);
	const editButton = (
		<Button
			stylingMode="1"
			text="Edit"
			width="70%"
			// customStyle={{ marginTop: "-5%" }}
		/>
	);
	const archeiveButton = (
		<Button
			stylingMode="2"
			text={product.isArchived ? "Deactivate" : "Activate"}
			width="70%"
			customStyle={{
				marginTop: "2%",
				color: product.isArchived ? "red" : "green",
				borderColor: product.isArchived ? "red" : "green",
				":hover": {
					backgroundColor: product.isArchived ? "red" : "green",
				},
			}}
		/>
	);
	const card = (
		<GenericCard
			image={image}
			aboveLine={[line1]}
			bottomLeft={[description, ratings]}
			bottomRight={[availableProducts, price, editButton, archeiveButton]}
			width={width}
			height={height}
		/>
	);
	return card;
};

export default CardProduct;
