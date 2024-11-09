import React, { useState } from "react";
import Button from "./Button";
import GenericCard from "./GenericCard";
import TitleAndButtons from "./TitleAndButtons";
import { Rating } from "@mui/material";
import { FaMapMarkerAlt, FaCalendarAlt, FaLanguage, FaTags } from "react-icons/fa";

const CardBooking = ({ booking, width, height, fontSize = "1.5rem" }) => {
	return (
		<GenericCard
			image="path-to-your-image.jpg"
			aboveLine={[]}
			bottomLeft={[]}
			bottomRight={[]}
			width="46vw"
			height="34vh"
		/>
	);
};

export default CardBooking;
