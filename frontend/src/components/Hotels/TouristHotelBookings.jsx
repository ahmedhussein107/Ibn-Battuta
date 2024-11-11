import React from "react";
import "./HotelList.css";
import HotelCard from "./HotelCard";
const room = {
	name: "Grand City Hotel",
	address: "123 Main Street, New York, USA",
	addressLandmark: "New Downtown",
	city: "New York",
	image: "https://cdn.pixabay.com/photo/2017/06/04/16/31/stars-2371478_1280.jpg",
	rooms: 10,
	bathrooms: 8,
	beds: 15,
	guests: 20,
	totalPrice: 200,
	checkIn: "12:00 PM",
	checkOut: "10:00 PM",
	cancellationPolicy: "Free cancellation",
	paymentMethod: "Credit Card",
	miniDescription: "This is a sample description.",
	description:
		"This is the whole description for the room.it is a lot of text and unnecessary information",
	bookingId: 344542321, // when booked
	_id: "git-it-done",
};

const TouristHotelBookings = ({ rooms }) => {
	let _list = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

	return (
		<div className="my-revservations-container">
			<div className="hotel-list-container">
				<div className="hotel-grid">
					{rooms.map((item, index) => (
						<HotelCard key={index} offer={item} isAllOffers={false} />
					))}
				</div>
			</div>
		</div>
	);
};

export default TouristHotelBookings;
