import React, { useState } from "react";
import Button from "./Button";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import TruncatedText from "./TruncatedText";
import { Rating } from "@mui/material";

const CardProduct = ({
	product,
	width,
	height,
	firstLineButtons,
	controlButtons,
	lowerHeight = "68%",
	upperHeight = "30%",
	line2 = <></>,
}) => {
	const image = product.pictures[0];
	const line1 = (
		<div style={{ fontSize: "1.8rem" }}>
			<TitleAndButtons title={product.name} buttons={firstLineButtons} />
		</div>
	);

	const description = (
		<TruncatedText text={product.description} width={"100%"} height={"80%"} fontSize={"2vh"} />
	);
	const rating = Math.floor(product.rating);
	console.log("rating", rating);
	const ratings = (
		<div style={{ display: "flex", flexDirection: "row" }}>
			<Rating name="read-only" value={rating} readOnly />
			<p style={{ marginLeft: "5%", marginTop: "0%" }}>{product.ratings.length}</p>
		</div>
	);
	const availableProducts = (
		<p
			style={{
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
			height="30%"
			customStyle={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		/>
	);
	const archeiveButton = (
		<Button
			stylingMode="2"
			text={product.isArchived ? "Deactivate" : "Activate"}
			width="70%"
			height="30%"
			customStyle={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				color: product.isArchived ? "red" : "green",
				borderColor: product.isArchived ? "red" : "green",
				":hover": {
					backgroundColor: product.isArchived ? "red" : "green",
				},
			}}
		/>
	);
	const buttons = (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-end",
				alignItems: "center",
				gap: "7%",
			}}
		>
			{price}
			{controlButtons}
		</div>
	);
	const card = (
		<GenericCard
			image={image}
			aboveLine={[line1, line2]}
			bottomLeft={[description, ratings]}
			bottomRight={[availableProducts, buttons]}
			width={width}
			height={height}
			upperHeight={upperHeight}
			lowerHeight={lowerHeight}
		/>
	);
	return card;
};

export default CardProduct;
