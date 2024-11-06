import ReviewsSection from "./ReviewsSection";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import ProfileAndDescription from "./ProfileAndDescription.jsx";
import CyclicPhotoDisplay from "./CyclicPhotoDisplay.jsx";
import ItineraryAndActivityHeader from "../../components/ItineraryAndActivityHeader.jsx";
import NavBar from "../../components/NavBar.jsx";
import Tags from "../../components/Tags.jsx";
import Book from "../../components/ItineraryDetails/Book.jsx";
import Footer from "../../components/Footer.jsx";
import AvailableDates from "../../components/ItineraryDetails/AvailableDates.jsx";
import "../../styles/ItineraryDetails.css";
const ItineraryDetails = () => {
	const reviews = [
		{
			reviewer: "Roba Hesham",
			rating: 5,
			comment: "Great experience!",
			createdAt: "2024-11-02T08:57:38.000Z",
		},
		{
			reviewer: "Ahmed Hussein",
			rating: 3,
			comment: "Not bad",
			createdAt: "2024-11-02T08:57:38.000Z",
		},
		{
			reviewer: "Arwa Khattab",
			rating: 3,
			comment: "Could be better",
			createdAt: "2024-11-02T08:57:38.000Z",
		},
		{
			reviewer: "Hana Elmalah",
			rating: 5,
			comment: "Wow!",
			createdAt: "2024-11-02T08:57:38.000Z",
		},
		{
			reviewer: "Ahmed kamal",
			rating: 3,
			comment: "Codeforces is much better",
			createdAt: "2024-11-02T08:57:38.000Z",
		},
		{
			reviewer: "Ahmed Yasser",
			rating: 4,
			comment: "Okay experience",
			createdAt: "2024-11-02T08:57:38.000Z",
		},
		{
			reviewer: "Ahmed El-Gohary",
			rating: 1,
			comment: "I hope you like this component",
			createdAt: "2024-11-02T08:57:38.000Z",
		},
		{
			reviewer: "Rahaf Alfarrash",
			rating: 5,
			comment: "Great experience!",
			createdAt: "2024-11-02T08:57:38.000Z",
		},
		{
			reviewer: "Rofaeil Samuel",
			rating: 5,
			comment: "Gamed ya Gohary",
			createdAt: "2024-11-02T08:57:38.000Z",
		},
		{
			reviewer: "Abdelrahim Abdelazim",
			rating: 2,
			comment: "My component is better",
			createdAt: "2024-11-02T08:57:38.000Z",
		},
	];

	const description =
		"This itinerary offers a mix of cultural exploration, outdoor adventures, and relaxation, allowing you to experience the destination's highlights. With guided tours, free time, and scenic excursions, it's designed to provide both excitement and leisure.";

	const photoList = [
		"https://images.unsplash.com/photo-1691147318681-e4f092efc350?q=80&w=3348&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1663616132535-e1e14b514c0f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fGJlYXV0aWZ1bCUyMHBsYWNlc3xlbnwwfHwwfHx8MA%3D%3D",
		"https://plus.unsplash.com/premium_photo-1676049111274-3ec809c03516?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGJlYXV0aWZ1bCUyMHBsYWNlc3xlbnwwfHwwfHx8MA%3D%3D",
		"https://plus.unsplash.com/premium_photo-1671358446946-8bd43ba08a6a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGJlYXV0aWZ1bCUyMHBsYWNlc3xlbnwwfHwwfHx8MA%3D%3D",
		"https://images.unsplash.com/photo-1616034887086-61dcbbcc787e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTcyfHxiZWF1dGlmdWwlMjBwbGFjZXN8ZW58MHx8MHx8fDA%3D",
	];

	const tags = ["refo", "refo", "refo", "refo", "refo", "refo", "refo"];

	const bookDate = { text: "Likely to be sell out", price: "$90.00" };

	return (
		<div>
			<NavBar />
			<ItineraryAndActivityHeader />
			<CyclicPhotoDisplay photos={photoList} width="50%" height="40vh" />

			<div className="itinerary-info">
				<div className="placeholder"></div>
				<div className="profile-refo-container">
					<ProfileAndDescription
						name={"Kevin Banana"}
						description={description}
						width={"38.2%"}
						height={"80%"}
						fontSize={"1.2em"}
					></ProfileAndDescription>
					<div className="refo-container">
						<div className="accessiblity-tags-reviewssection">
							<span>Accessibility</span>
							<Tags tags={tags} fontSize={"0.8em"} />
							<ReviewsSection
								reviews={reviews}
								width={"100%"}
								height={"50%"}
								fontSize={"12px"}
							/>
						</div>

						{/* Done */}
						<div className="book-availabledates">
							<Book price={bookDate.price} text={bookDate.text} />
							<AvailableDates width="18vw" fontSize={"0.8em"} />
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default ItineraryDetails;
