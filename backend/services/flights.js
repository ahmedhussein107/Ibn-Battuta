import express from "express";
import Amadeus from "amadeus";
import { isAuthenticated } from "../routers.middleware/authentication.js";
import Tourist from "../models/tourist.model.js";

import { API_KEY, API_SECRET } from "../config/config.js";

const amadeusFlightsRouter = express.Router();

const amadeus = new Amadeus({
    clientId: API_KEY,
    clientSecret: API_SECRET,
});

amadeusFlightsRouter.get("/airport-search", async (req, res) => {
    const { keyword } = req.query;
    try {
        const response = await amadeus.referenceData.locations.cities.get({
            keyword,
        });

        res.status(200).send(response.data.filter((city) => city.iataCode != undefined));
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

amadeusFlightsRouter.get("/search", async (req, res) => {
    // TODO: change currency to match the user currency
    try {
        const { result } = await amadeus.shopping.flightOffersSearch.get({
            ...req.query,
            max: 100,
            currencyCode: "EGP",
        });
        res.status(200).send(result);
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

const adultTraveller = {
    id: "1",
    dateOfBirth: "1982-01-16",
    name: {
        firstName: "JORGE",
        lastName: "GONZALES",
    },
    gender: "MALE",
    contact: {
        emailAddress: "jorge.gonzales833@telefonica.es",
        phones: [
            {
                deviceType: "MOBILE",
                countryCallingCode: "34",
                number: "480080076",
            },
        ],
    },
    documents: [
        {
            documentType: "PASSPORT",
            birthPlace: "Madrid",
            issuanceLocation: "Madrid",
            issuanceDate: "2015-04-14",
            number: "00000000",
            expiryDate: "2025-04-14",
            issuanceCountry: "ES",
            validityCountry: "ES",
            nationality: "ES",
            holder: true,
        },
    ],
};

const childTraveller = {
    id: "2",
    dateOfBirth: "2020-10-11",
    gender: "FEMALE",
    contact: {
        emailAddress: "jorge.gonzales833@telefonica.es",
        phones: [
            {
                deviceType: "MOBILE",
                countryCallingCode: "34",
                number: "480080076",
            },
        ],
    },
    name: {
        firstName: "ADRIANA",
        lastName: "GONZALES",
    },
};

amadeusFlightsRouter.post("/book", isAuthenticated, async (req, res) => {
    const touristID = req.user.userId;
    const { flightOffer, airlines } = req.body;
    const travelers = flightOffer.travelerPricings.map((element, index) => {
        if (element.travelerType === "ADULT") {
            const adult = { ...adultTraveller };
            adult.id = element.travelerId;
            return adult;
        } else {
            const child = { ...childTraveller };
            child.id = element.travelerId;
            return child;
        }
    });

    try {
        const bookingResponse = await amadeus.booking.flightOrders.post({
            data: {
                type: "flight-order",
                flightOffers: [flightOffer],
                travelers,
            },
        });

        const tourist = await Tourist.findById(touristID);

        if (tourist) {
            if (!tourist.flightBookings) tourist.flightBookings = [];
            bookingResponse.data.flightOffers = [flightOffer];
            bookingResponse.data.airlines = airlines;
            tourist.flightBookings.push(bookingResponse.data);
            await tourist.save();
        } else {
            return res.status(400).send({ error: "Tourist not found" });
        }

        res.status(200).send({ bookingResponse });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
});

export default amadeusFlightsRouter;
