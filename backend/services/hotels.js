import express from "express";
import Amadeus from "amadeus";

import { API_KEY, API_SECRET } from "../config/config.js";

const amadeusHotelsRouter = express.Router();

const amadeus = new Amadeus({
    clientId: API_KEY,
    clientSecret: API_SECRET,
});

// TODO: add list of avialable cities to the frontend
amadeusHotelsRouter.get("/search/city", async (req, res) => {
    try {
        const { result } = await amadeus.referenceData.locations.cities.get({
            keyword: req.query.cityName,
        });
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

amadeusHotelsRouter.get("/search/by-city", async (req, res) => {
    try {
        const { cityCode } = req.query;
        const { result } = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode,
        });
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

amadeusHotelsRouter.get("/search/by-geo-code", async (req, res) => {
    const { latitude, longitude } = req.query;
    try {
        const { result } = await amadeus.referenceData.locations.hotels.byGeocode.get({
            latitude,
            longitude,
            radius: 10,
        });
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

amadeusHotelsRouter.get("/search/by-hotel", async (req, res) => {
    try {
        const { hotelIds } = req.query;
        const { result } = await amadeus.shopping.hotelOffersByHotel.get({
            hotelIds,
        });
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

amadeusHotelsRouter.get("/search/hotel-offers", async (req, res) => {
    try {
        const { lat, lng, start, end, guests } = req.query;
        console.log("lat, lng, start, end, guests", lat, lng, start, end, guests);
        const hotelsResponse = await amadeus.referenceData.locations.hotels.byGeocode.get(
            {
                latitude: lat,
                longitude: lng,
                radius: 10,
            }
        );

        const hotels = hotelsResponse.result.data;
        const hotelIds = hotels.map((hotel) => hotel.hotelId);
        console.log("hotelIds are", hotelIds);
        const { result } = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: hotelIds.join(","),
            checkInDate: start,
            checkOutDate: end,
            adults: guests,
        });
        resposne = [];

        for (let hotelData of result) {
            for (let hotelOffer of hotelData) {
                console.log("hotelOffer is", hotelOffer);
                const offer = {};
                offer.name = hotelOffer?.hotel?.name;
                offer.totalPrice =
                    hotelOffer?.price?.total + " " + hotelOffer?.price?.currency;
                offer.checkIn = hotelOffer?.checkInDate;
                offer.checkOut = hotelOffer?.checkOutDate;
                offer.guests = hotelOffer?.guests?.adults;
                offer.paymentMethod = hotelOffer?.policies?.paymentType;
                offer.description = hotelOffer?.room?.description?.text;
                offer.beds = hotelOffer?.room?.typeEstimated?.beds;
                offer._id = hotelOffer?.id;
                offer.cancellationPolicy =
                    hotelOffer?.policies?.cancellation?.[0]?.description?.text;
                offer.city = hotelData.cityCode;
                miniDescription =
                    hotelOffer?.room?.typeEstimated?.category +
                    ", " +
                    hotelOffer?.room?.typeEstimated?.bedType +
                    " beds";
                response.push(offer);
            }
        }
        console.log("result is", result);
        res.status(200).send(response);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//TODO: add booking to tourist

amadeusHotelsRouter.post("/book-hotel", async (req, res) => {
    const { body } = req;
    try {
        const { result } = await amadeus.booking.hotelOrders.post(body);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default amadeusHotelsRouter;
