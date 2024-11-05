import Book from "../components/ItineraryDetails/Book";

export default function ItineraryDetails() {
	function handleBooking() {
		console.log("Booking is done");
	}

	return (
		<div>
			<h1>Itinerary Details</h1>
			<Book
				price={"$99.00"}
				text={"Likely sell out"}
				onClick={handleBooking}
			/>
		</div>
	);
}
