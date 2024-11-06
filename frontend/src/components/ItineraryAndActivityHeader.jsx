import ShareAndMark from "./ShareAndMark.jsx";
import "../styles/ItineraryAndActivityHeader.css";

export default function ItineraryAndActivityHeader({
	title = "Itinerary Title",
	mode = "activity",
	isOpen = false,
	category = "Balabizo",
}) {
	return (
		<div className="itinerary-and-activity-header-container">
			<div className="activity-title">
				<h1>{title}</h1>
				{mode === "activity" && (
					<div className="activity-info-container">
						<div className="booking-state">
							<img
								src={
									isOpen
										? "/bookingOpenIcon.png"
										: "/BookingClosedIcon.png"
								}
								alt=""
							/>
							<span>
								{" "}
								{isOpen
									? " Open For Booking"
									: "Booking Closed"}
							</span>
						</div>
						<div className="category">Category: {category}</div>
					</div>
				)}
			</div>

			<ShareAndMark width="15%" />
		</div>
	);
}
