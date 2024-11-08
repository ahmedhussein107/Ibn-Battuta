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
import ItineraryTimeline from "../../components/ItineraryTimline.jsx";

const ItineraryDetails = () => {
	const [itinerary, setItinerary] = useState({
		_id: "6703f5310ecc1ad25ff95144",
		name: "Tour a the German University in Cairo",
		description:
			"Join me on a tour of GUC, where algorithms roam free, data structures tower like monuments, and every lecture hall holds the secrets of untamed code. Get ready to navigate loops, dodge runtime errors, and debug your way to enlightenment! And finally Balabizo!",
		tourguideID: "6700044e887e126c909d6f21",
		activities: [
			{
				activityType: "Activity",
				activity: "670405f81ddb4f53fd971cd8",
				startTime: "2024-11-07T09:30:00.000Z",
				endTime: "2024-11-07T12:45:00.000Z",
				_id: "6703f5310ecc1ad25ff95145",
				id: "6703f5310ecc1ad25ff95145",
			},
			{
				activityType: "Activity",
				activity: "670740b8290174553a39cd54",
				startTime: "2024-11-07T09:30:00.000Z",
				endTime: "2024-11-07T12:45:00.000Z",
				_id: "672cb13500b4345568fbfae6",
				id: "672cb13500b4345568fbfae6",
			},
			
		],
		pickupTime: "2024-11-07T12:45:00.000Z",
		language: "Arabic",
		accessibility: ["weelchair", "ambulance cars"],
		price: 1000,
		availableDatesAndTimes: ["2024-12-20T00:00:00.000Z"],
		pickup: "GUC",
		dropOff: "GUC",
		tags: ["sky diving", "sea"],
		isActivated: true,
		isFlagged: false,
		ratings: ["672b666a8c7e37c372c27ebd"],
		sumOfRatings: 125,
		createdAt: "2024-10-07T14:50:25.807Z",
		updatedAt: "2024-11-06T12:51:54.972Z",
		location: "Cairo,Eg",
		picture: "https://i.postimg.cc/dtYPjDgS/guc.jpg",
		__v: 1,
		rating: 125,
		id: "6703f5310ecc1ad25ff95144",
	});
	const [photoList, setPhotoList] = useState([]);
	const [tourGuideName, setTourGuideName] = useState(null);
	const [tourGuidePicture, setTourGuidePicture] = useState(null);
	const [tags, setTags] = useState(itinerary.tags);
	const [activities, setActivities] = useState([]);
	const description = itinerary.description;
	const price = itinerary.price;
	const language = itinerary.language;
	const accessibility = itinerary.accessibility;
	const itineraryTitle = itinerary.name;
	const pickup = itinerary.pickup;
	const dropoff = itinerary.dropOff;
	const pickuptime = itinerary.pickupTime;


	//For Tour guide name and photo
	useEffect(() => {
		const fetchTourGuide = async () => {
			try {
				const response = await axiosInstance.get(
					`tourguide/tourGuide/${itinerary.tourguideID}`
				);
				const tourguide = response.data;
				setTourGuideName(tourguide.name);
				setTourGuidePicture(tourguide.picture);
			} catch (error) {
				console.error("Error fetching reviews: ", error);
			}
		};
		fetchTourGuide();
	}, [itinerary.tourguideID]);

	//For activities and photos
	useEffect(() => {
		const fetchActivites = async () => {
			try {
				const activitiesData = await Promise.all(
					itinerary.activities.map(async (activityObj) => {
						// First API call to get the rating details
						const isCustom = activityObj.activityType != "Activity";
						const activityResponse = await axiosInstance.get(
							!isCustom
								? `activity/getActivity/${activityObj.activity}`
								: `customActivity/getCustomActivity/${activityObj.activity}`
						);
						const activity = activityResponse.data;

						// Extract and format start and end times
						const formatTime = (date) => {
							const options = {
								hour: "numeric",
								minute: "numeric",
								hour12: true,
							};
							return new Date(date).toLocaleTimeString(
								"en-US",
								options
							);
						};

						const startTimeFormatted = formatTime(
							activityObj.startTime
						);
						const endTimeFormatted = formatTime(
							activityObj.endTime
						);

						// Calculate duration in minutes
						const durationMs =
							new Date(activityObj.endTime) -
							new Date(activityObj.startTime);
						const durationMinutes = Math.floor(durationMs / 60000); // convert ms to minutes

						// Construct the activity object with formatted times and duration
						return {
							activityType: activityObj.activityType,
							activityData: activity,
							startTime: startTimeFormatted,
							endTime: endTimeFormatted,
							duration: `${Math.floor(durationMinutes / 60)}h ${
								durationMinutes % 60
							}m`,
						};
					})
				);

				const photosData = activitiesData
					.filter((activity) => activity.activityType === "Activity" && activity.activityData.picture)
					.map((activity) => {
						return activity.activityData.picture;
					});
				photosData.push(itinerary.picture);

				setPhotoList(photosData);
				// Update the state with the reviews data
				setActivities(activitiesData);
			} catch (error) {
				console.error("Error fetching activities: ", error);
			}
		};

		fetchActivites();
	}, [itinerary.activities]);

	return (
		<div className="itinerary-details-container">
			<NavBar />

			<ItineraryAndActivityHeader
				mode="itinerary"
				title={itineraryTitle}
			/>
			<CyclicPhotoDisplay photos={photoList} width="95%" height="70vh" />

			<div className="itinerary-info">
				<div className="placeholder">
					<ItineraryTimeline
						pickUpLocation={pickup}
						pickUpTime={pickuptime}
						dropOffLocation={dropoff}
						activities={activities}
					/>
					{/* pickyp location, pickup time, drop off location, and activity details array */}
				</div>

				<div className="profile-refo-container">
					<ProfileAndDescription
						name={tourGuideName || "balabizo"}
						picture={tourGuidePicture}
						description={description}
						width={"80%"}
						// height={"50%"}
						fontSize={"1.2em"}
					></ProfileAndDescription>
					<div className="refo-container">
						<div className="accessiblity-tags-reviewssection">
							<div className="language-container">
								<div
									className="language-header"
									style={{ fontSize: "0.8em" }}
								>
									<img
										src="/languageIcon.png"
										alt=""
										className="language-icon"
									/>
									<span>Language: {language}</span>
								</div>
							</div>
							<Accessibility
								accessibilities={accessibility}
								fontSize={"0.8em"}
							/>
							<Tags tags={tags} fontSize={"0.85em"} />
							<ReviewsSection
								ratingIds={itinerary.ratings}
								width={"100%"}
								fontSize={"12px"}
							/>
						</div>

						{/* Done */}
						<div className="book-availabledates">
							<Book price={price} text={"Likely to be out "} />
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
