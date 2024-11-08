import React, { useState, useEffect } from "react";
import "../styles/TicketCounter.css";

const TicketCounter = ({ pricePerPerson, maxCount }) => {
	const [ticketCount, setTicketCount] = useState( maxCount > 0 ? 1 : 0); // initial value
	const [maxReached, setMaxReached] = useState(ticketCount >=maxCount);
	const totalPrice = ticketCount * pricePerPerson;

 
	const increment = () => {
		if (maxReached) return;
		setTicketCount(ticketCount + 1);
		if (ticketCount +1 == maxCount) {
			setMaxReached(true);
		}
	};
	const decrement = () => {
		if (ticketCount > 1){
            setTicketCount(ticketCount - 1);
            if(maxReached) setMaxReached(false);
        } 

	};

	return (
		<div className="ticket-counter">
			<h2>Number of Tickets</h2>
			<div className="counter">
				<button onClick={decrement} className="counter-button">
					-
				</button>
				<span className="ticket-count">{ticketCount}</span>
				{!maxReached && 
					<button onClick={increment} className="counter-button">
						+
					</button>
				}
			</div>
			<div className="price-display">
				<div className="price-row">
					<span>Price per person</span>
					<span className="price">{pricePerPerson.toFixed(2)}</span>
				</div>
				<div className="price-row">
					<span>Total Price</span>
					<span className="price">{totalPrice.toFixed(2)}</span>
				</div>
			</div>
			{maxReached && (
				<span>
					Cannot book more Tickets! Maximum free spots {maxCount >1 ? "are": "is"} {maxCount}
				</span>
			)}
		</div>
	);
};

export default TicketCounter;
