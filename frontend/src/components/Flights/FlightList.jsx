import FlightCard from "./FlightCard";
import { useNavigate } from "react-router-dom";

const FlightList = ({ flightOffers, flightBookings, airlines, handleView, mode = 1 }) => {
	const navigate = useNavigate();
	console.log("hello", flightBookings);
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				flexWrap: "wrap",
				justifyContent: "flex-start",
			}}
		>
			{mode == 1 &&
				flightOffers &&
				flightOffers.map((flightOffer, index) => (
					<FlightCard
						key={index}
						trip={flightOffer}
						airlines={airlines}
						handleClick={() => handleView(index)}
					/>
				))}

			{mode == 2 &&
				flightBookings &&
				flightBookings.map((flightBooking, index) => (
					<FlightCard
						key={index}
						trip={flightBooking.flightOffers[0]}
						airlines={flightBooking.airlines || {}}
						handleClick={() =>
							navigate("/flight-booking-details", {
								state: {
									flightOffer: flightBooking.flightOffers[0],
									airlines: flightBooking.airlines || {},
									bookingNumber: flightBooking.id,
								},
							})
						}
						mode={2}
						bookingNumber={flightBooking.id}
					/>
				))}
		</div>
	);
};

export default FlightList;
