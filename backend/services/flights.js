import express from "express";
import Amadeus from "amadeus";
const API_KEY = process.env.AMADEUS_API_KEY;
const API_SECRET = process.env.AMADEUS_API_SECRET;

const amadeusFlightsRouter = express.Router();

const amadeus = new Amadeus({
	clientId: API_KEY,
	clientSecret: API_SECRET,
});

amadeusFlightsRouter.get("/search", async (req, res) => {
	// TODO: handle additional info
	const { originLocationCode, destinationLocationCode, departureDate, adults } =
		req.query;
	try {
		const { result } = await amadeus.shopping.flightOffersSearch.get({
			originLocationCode,
			destinationLocationCode,
			departureDate,
			adults,
		});
		const pricingResponse = await amadeus.shopping.flightOffers.pricing.post({
			data: {
				type: "flight-offers-pricing",
				flightOffers: [result.data[0]],
			},
		});

		res.status(200).send({ pricingResponse });
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

amadeusFlightsRouter.get("/get-pricing", async (req, res) => {
	const { flightOffers } = req.body;
	try {
		const pricingResponse = await amadeus.shopping.flightOffers.pricing.post({
			data: {
				type: "flight-offers-pricing",
				flightOffers,
			},
		});
		res.status(200).send({ pricingResponse });
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

// TODO: add booking to tourist

amadeusFlightsRouter.get("/book", async (req, res) => {
	const { flightOffers, travelersList } = req.body;
	try {
		const bookingResponse = await amadeus.booking.flightOrders.post({
			data: {
				type: "flight-order",
				flightOffers,
				travelers: travelersList,
			},
		});
		res.status(200).send({ bookingResponse });
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

export default amadeusFlightsRouter;
