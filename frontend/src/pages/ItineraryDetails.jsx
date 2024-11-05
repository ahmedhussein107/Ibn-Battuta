import AvailableDates from "../components/ItineraryDetails/AvailableDates";
import Book from "../components/ItineraryDetails/Book";

export default function ItineraryDetails() {
	function handleBooking() {
		console.log("Booking is done");
	}

	return (
		<div>
			<h1>Itinerary Details</h1>
			<Book price={"$90.00"} text={"Likely to be out"} width={"20vw"} />
		</div>
	);
}
