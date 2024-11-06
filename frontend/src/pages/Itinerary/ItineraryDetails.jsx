import ReviewsSection from "./ReviewsSection";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import ProfileAndDescription from "./ProfileAndDescription.jsx";
import CyclicPhotoDisplay from "./CyclicPhotoDisplay.jsx";
import ItineraryAndActivityHeader from "../../components/ItineraryAndActivityHeader.jsx";
import NavBar from "../../components/NavBar.jsx";
import Tags from "../../components/Tags.jsx";
import Accessibility from "../../components/Accessibility.jsx";
import Book from "../../components/ItineraryDetails/Book.jsx";
import Footer from "../../components/Footer.jsx";
import AvailableDates from "../../components/ItineraryDetails/AvailableDates.jsx";
import "../../styles/ItineraryDetails.css";
import {useLocation} from "react-router-dom";
const ItineraryDetails = () => {

	const [itinerary, setItinerary] = useState({
			"_id": "6703f5310ecc1ad25ff95144",
			"name": "tour in GUC",
			"description": "best itinerary ever as, I also love ahmed hussien because he is my friend",
			"tourguideID": "6700044e887e126c909d6f21",
			"activities": [
				{
					"activityType": "Activity",
					"activity": "670405f81ddb4f53fd971cd8",
					"_id": "6703f5310ecc1ad25ff95145",
					"id": "6703f5310ecc1ad25ff95145"
				}
			],
			"language": "Arabic",
			"accessibility": [
				"weelchair",
				"ambulance cars"
			],
			"price": 1000,
			"availableDatesAndTimes": [
				"2024-12-20T00:00:00.000Z"
			],
			"pickup": "GUC",
			"dropOff": "GUC",
			"tags": ["sky diving", "sea"],
			"isActivated": true,
			"isFlagged": false,
			"ratings": [
				"672b666a8c7e37c372c27ebd"
			],
			"sumOfRatings": 125,
			"createdAt": "2024-10-07T14:50:25.807Z",
			"updatedAt": "2024-11-06T12:51:54.972Z",
			"location": "Cairo,Eg",
			"picture": "https://i.postimg.cc/dtYPjDgS/guc.jpg",
			"__v": 1,
			"rating": 125,
			"id": "6703f5310ecc1ad25ff95144"
		}
	);

	const fetchItinerary = async () => {
		try {
			//const response = await axios.get(`itinerary/getItinerary/6703f5310ecc1ad25ff95144`);
			//setItinerary(response.data);
		} catch (error) {
			console.error("Error fetching itinerary:", error);
		}
	};

	useEffect(() => {
		fetchItinerary();
	}, []);

	const [reviews, setReviews] = useState([]);
	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const reviewsData = await Promise.all(
					itinerary.ratings.map(async (ratingID) => {
						const ratingResponse = await axiosInstance.get(`rating/getRating/${ratingID}`);
						const rating = ratingResponse.data;
						const response = await axiosInstance.get(`tourist/tourist/${rating.touristID}`);
						const tourist = response.data;

						return {
							reviewer: tourist.name,
							rating: rating.rating,
							comment: rating.comment,
							createdAt: new Date(rating.createdAt).toLocaleDateString()
						};
					})
				);

				setReviews(reviewsData);
			} catch (error) {
				console.error("Error fetching reviews: ", error);
			}
		};

		if (itinerary.ratings && itinerary.ratings.length > 0) {
			fetchReviews();
		}
	}, [itinerary.ratings]);

	// const reviews = [
	// 	{
	// 		reviewer: "Roba Hesham",
	// 		rating: 5,
	// 		comment: "Great experience!",
	// 		createdAt: "2024-11-02T08:57:38.000Z",
	// 	},
	// 	{
	// 		reviewer: "Ahmed Hussein",
	// 		rating: 3,
	// 		comment: "Not bad",
	// 		createdAt: "2024-11-02T08:57:38.000Z",
	// 	},
	// 	{
	// 		reviewer: "Arwa Khattab",
	// 		rating: 3,
	// 		comment: "Could be better",
	// 		createdAt: "2024-11-02T08:57:38.000Z",
	// 	},
	// 	{
	// 		reviewer: "Hana Elmalah",
	// 		rating: 5,
	// 		comment: "Wow!",
	// 		createdAt: "2024-11-02T08:57:38.000Z",
	// 	},
	// 	{
	// 		reviewer: "Ahmed kamal",
	// 		rating: 3,
	// 		comment: "Codeforces is much better",
	// 		createdAt: "2024-11-02T08:57:38.000Z",
	// 	},
	// 	{
	// 		reviewer: "Ahmed Yasser",
	// 		rating: 4,
	// 		comment: "Okay experience",
	// 		createdAt: "2024-11-02T08:57:38.000Z",
	// 	},
	// 	{
	// 		reviewer: "Ahmed El-Gohary",
	// 		rating: 1,
	// 		comment: "I hope you like this component",
	// 		createdAt: "2024-11-02T08:57:38.000Z",
	// 	},
	// 	{
	// 		reviewer: "Rahaf Alfarrash",
	// 		rating: 5,
	// 		comment: "Great experience!",
	// 		createdAt: "2024-11-02T08:57:38.000Z",
	// 	},
	// 	{
	// 		reviewer: "Rofaeil Samuel",
	// 		rating: 5,
	// 		comment: "Gamed ya Gohary",
	// 		createdAt: "2024-11-02T08:57:38.000Z",
	// 	},
	// 	{
	// 		reviewer: "Abdelrahim Abdelazim",
	// 		rating: 2,
	// 		comment: "My component is better",
	// 		createdAt: "2024-11-02T08:57:38.000Z",
	// 	},
	// ];

	const description = itinerary.description;
	// "This itinerary offers a mix of cultural exploration, outdoor adventures, and relaxation, allowing you to experience the destination's highlights. With guided tours, free time, and scenic excursions, it's designed to provide both excitement and leisure.";

	const [activites, setActivities] = useState([]);
	const [photoList, setPhotoList] = useState([]);
	useEffect(() => {
		const fetchActivites = async () => {
			try {
				const activityData = await Promise.all(
					itinerary.activities.map(async (activityObject) => {
						const activityResponse = await axiosInstance.get(`activity/getActivity/${activityObject.activity}`);
						return activityResponse.data;
					})
				);
				const photosData = activityData.map(activity => {
					return activity.picture;
				})
				photosData.push(itinerary.picture);

				setPhotoList(photosData);
				setActivities(activityData);
			} catch (error) {
				console.error("Error fetching reviews: ", error);
			}
		};

		fetchActivites();
	}, [itinerary.activities]);

	// const photoList = [
	// 	"https://images.unsplash.com/photo-1691147318681-e4f092efc350?q=80&w=3348&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	// 	"https://images.unsplash.com/photo-1663616132535-e1e14b514c0f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fGJlYXV0aWZ1bCUyMHBsYWNlc3xlbnwwfHwwfHx8MA%3D%3D",
	// 	"https://plus.unsplash.com/premium_photo-1676049111274-3ec809c03516?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGJlYXV0aWZ1bCUyMHBsYWNlc3xlbnwwfHwwfHx8MA%3D%3D",
	// 	"https://plus.unsplash.com/premium_photo-1671358446946-8bd43ba08a6a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGJlYXV0aWZ1bCUyMHBsYWNlc3xlbnwwfHwwfHx8MA%3D%3D",
	// 	"https://images.unsplash.com/photo-1616034887086-61dcbbcc787e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTcyfHxiZWF1dGlmdWwlMjBwbGFjZXN8ZW58MHx8MHx8fDA%3D",
	// ];

	const tags = itinerary.tags;
	
	const bookDate = { text: "Likely to be sell out", price: "$" + itinerary.price };

	const [tourGuide, setTourGuide] = useState(null);
	useEffect(() => {
		const fetchTourGuide = async () => {
			console.log("I am here");
			try {
				const response  = await axiosInstance.get(`tourguide/tourGuide/${itinerary.tourguideID}`);
				const tourguide = response.data;
				console.log(tourguide);
				setTourGuide(tourguide.name);
			} catch (error) {
				console.error("Error fetching reviews: ", error);
			}
		}
		fetchTourGuide();
	}, [itinerary.tourguideID]);




	return (
		<div className="itinerary-details-container">
			<NavBar />
			<ItineraryAndActivityHeader title={itinerary.name} mode="itinerary" width />
			<CyclicPhotoDisplay photos={photoList} width="90%" height="40vh" />

			<div className="itinerary-info">
				<div className="placeholder">Hello</div>
				<div className="profile-refo-container">
					<ProfileAndDescription
						name={"ahmed"}
						description={description}
						width={"80%"}
						// height={"50%"}
						fontSize={"1.2em"}
					></ProfileAndDescription>
					<div className="refo-container">
						<div className="accessiblity-tags-reviewssection">	
							<Accessibility accessibilities={itinerary.accessibility} fontSize={"0.8em"} />
							<Tags tags={tags} fontSize={"0.8em"} />
							<ReviewsSection
								reviews={reviews}
								width={"100%"}
								fontSize={"12px"}
							/>
						</div>

						{/* Done */}
						<div className="book-availabledates">
							<Book price={bookDate.price} text={bookDate.text} />
							<AvailableDates dates={itinerary.availableDatesAndTimes} width="18vw" fontSize={"0.8em"} />
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default ItineraryDetails;
