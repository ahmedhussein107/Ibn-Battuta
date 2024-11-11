import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// External libraries or API instance
import axiosInstance from "../../api/axiosInstance";

// Components relevant to this file
import ReviewsSection from "./ReviewsSection.jsx";
import ProfileAndDescription from "./ProfileAndDescription.jsx";
import CyclicPhotoDisplay from "./CyclicPhotoDisplay.jsx";

// Top-level components
import NavBar from "../../components/NavBar.jsx";
import ItineraryAndActivityHeader from "../../components/ItineraryAndActivityHeader.jsx";
import Tags from "../../components/Tags.jsx";
import Accessibility from "../../components/Accessibility.jsx";
import Footer from "../../components/Footer.jsx";
import PopUp from "../../components/PopUpsGeneric/PopUp.jsx";
import TicketCounter from "../../components/TicketCounter.jsx";
import SuccessfulBooking from "../../components/SuccessfulBooking.jsx";
import usePageHeader from "../../components/Header/UseHeaderPage.jsx";

// Itinerary details components
import Book from "../../components/ItineraryDetails/Book.jsx";
import AvailableDates from "../../components/ItineraryDetails/AvailableDates.jsx";
import ItineraryTimeline from "../../components/ItineraryTimline.jsx";

// Styles
import "../../styles/ItineraryDetails.css";

const ItineraryDetails = () => {
	const location = useLocation();
	usePageHeader(null, null);
	const [itinerary, setItinerary] = useState(
		(location.state && location.state.itineraryDetails) || {
			_id: "6703f5310ecc1ad25ff95144",
			name: "Tour in GUC (Don't touch it)",
			description:
				"Join me on a tour of GUC, where algorithms roam free, data structures tower like monuments, and every lecture hall holds the secrets of untamed code. Get ready to navigate loops, dodge runtime errors, and debug your way to enlightenment! And finally Balabizo!",
			tourguideID: "6700044e887e126c909d6f21",
			activities: [
				{
					activityType: "Activity",
					activity: "672fb44bebf736b1cf3d51a8",
					startTime: "2024-11-07T09:30:00.000Z",
					endTime: "2024-11-07T12:45:00.000Z",
				},
				{
					activityType: "Activity",
					activity: "672fb349ebf736b1cf3d519b",
					startTime: "2024-11-07T09:30:00.000Z",
					endTime: "2024-11-07T12:45:00.000Z",
				},
			],
			pickupTime: "2024-11-07T12:45:00.000Z",
			language: "Arabic",
			accessibility: ["weelchair", "ambulance cars"],
			price: 1000,
			availableDateAndTime: "2024-12-20T00:00:00.000Z",
			pickup: "GUC",
			dropOff: "GUC",
			tags: ["sky diving", "sea"],
			isActivated: true,
			isFlagged: false,
			isOpenForBooking:true,
			ratings: ["672b666a8c7e37c372c27ebd", ],
			sumOfRatings: 125,
			createdAt: "2024-10-07T14:50:25.807Z",
			updatedAt: "2024-11-06T12:51:54.972Z",
			location: "Cairo,Eg",
			picture: "https://i.postimg.cc/dtYPjDgS/guc.jpg",
			__v: 1,
			rating: 125,
			id: "6703f5310ecc1ad25ff95144",
		}
	);

	//For mangaing page logic
	const [BookPopUp, setBookPopUp] = useState(false);
	const [bookingDonePopUp, setBookingDonePopUp] = useState(false);

	const handleBooking = async () => {
		try {
			// TODO: add different ways of payeen

			const bookingResponse = await axiosInstance.post(
				"booking/createBooking",
				{
					bookingType: "Itinerary",
					typeId: itinerary._id,
					count: ticketCount,
				},
				{ withCredentials: true }
			);

			// Check the response status
			if (bookingResponse.status === 201) {
				// Add any additional success handling here
				setPointsAdded(bookingResponse.data.pointsAdded);
				setBookPopUp(false);
				setBookingDonePopUp(true);
			} else {
				console.log(
					"Booking response received, but status is not 201:",
					bookingResponse.status
				);
				// Handle other status codes as needed
			}
		} catch (error) {
			console.error("Booking failed:", error);
			// Handle error here, like displaying a notification to the user
			if (error.response) {
				// The request was made and the server responded with a status code outside the 2xx range
				console.error("Error status:", error.response.status);
				console.error("Error data:", error.response.data);
			} else if (error.request) {
				// The request was made but no response was received
				console.error("No response received:", error.request);
			} else {
				// Something happened in setting up the request
				console.error("Error setting up request:", error.message);
			}
		}
	};

	//For managing itinerary data
	const [photoList, setPhotoList] = useState([]);
	const [pointsAdded, setPointsAdded] = useState(0);
	const [tourGuideName, setTourGuideName] = useState(null);
	const [tourGuidePicture, setTourGuidePicture] = useState(null);
	const [activities, setActivities] = useState([]);
	const [ticketCount, setTicketCount] = useState(0);
	const [freeSpots, setFreeSpots] = useState(Number.MAX_VALUE); // Initialize with maximum number
	const totalPrice = itinerary.price * ticketCount;

	//For getting free spots

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
				console.error("Error fetching Tour guid	: ", error);
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
						if (
							!isCustom &&
							activity &&
							activity.freeSpots !== undefined
						) {
							setFreeSpots((prevFreeSpots) =>
								Math.min(prevFreeSpots, activity.freeSpots)
							);
						}
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

                        const startTimeFormatted = formatTime(activityObj.startTime);
                        const endTimeFormatted = formatTime(activityObj.endTime);

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
					.filter(
						(activity) =>
							activity.activityType === "Activity" &&
							activity.activityData.pictures
					)
					.flatMap((activity) => activity.activityData.pictures);

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
            <ItineraryAndActivityHeader mode="itinerary" title={itinerary.itineraryTitle} />
            <CyclicPhotoDisplay photos={photoList} width="95%" height="70vh" />

			<PopUp
				isOpen={BookPopUp}
				setIsOpen={setBookPopUp}
				headerText={
					"Please fill in the following to complete your booking"
				}
				handleSubmit={handleBooking}
			>
				<TicketCounter
					pricePerPerson={itinerary.price}
					maxCount={freeSpots}
					currentCount={ticketCount}
					setCount={setTicketCount}
				/>
			</PopUp>

			<PopUp
				isOpen={bookingDonePopUp}
				setIsOpen={setBookingDonePopUp}
				headerText={"Booking Successful"}
				containsActionButton={false}
				cancelText={"Ok"}
			>
				<SuccessfulBooking  points={pointsAdded}/>
			</PopUp>

			<ItineraryAndActivityHeader
				mode="itinerary"
				title={itinerary.name}
			/>

			<div className="itinerary-info">
				<div className="placeholder">
					<ItineraryTimeline
						pickUpLocation={itinerary.pickup}
						pickUpTime={itinerary.pickupTime}
						dropOffLocation={itinerary.dropOff}
						activities={activities}
					/>
					{/* pickyp location, pickup time, drop off location, and activity details array */}
				</div>

				<div className="profile-refo-container">
					<ProfileAndDescription
						name={tourGuideName || "balabizo"}
						picture={tourGuidePicture}
						description={itinerary.description}
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
									<span>Language: {itinerary.language}</span>
								</div>
							</div>
							<Accessibility
								accessibilities={itinerary.accessibility}
								fontSize={"0.8em"}
							/>
							<Tags tags={itinerary.tags} fontSize={"0.85em"} />
							<ReviewsSection
								ratingIds={itinerary.ratings}
								width={"100%"}
								fontSize={"12px"}
							/>
						</div>

						{/* Done */}
						<div className="book-availabledates">
							<Book
								price={itinerary.price}
								text={"Likely to be out "}
								onClick={() => {
									// Open pop up with booking details
									setBookPopUp(true);
								}}
							/>
							<AvailableDates
								date={itinerary.availableDateAndTime}
								width="18vw"
								fontSize={"0.8em"}
							/>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default ItineraryDetails;
