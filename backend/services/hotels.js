import express from "express";
import Amadeus from "amadeus";

import { API_KEY, API_SECRET } from "../config/config.js";

const amadeusHotelsRouter = express.Router();

const amadeus = new Amadeus({
    clientId: API_KEY,
    clientSecret: API_SECRET,
});

// TODO: add list of avialable cities to the frontend

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
        const { result } = await amadeus.shopping.hotelOffers.gessociatedRecordst({
            latitude,
            longitude,
        });
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

amadeusHotelsRouter.get("/search/by-hotel", async (req, res) => {
    try {
        const { hotelId } = req.query;
        const { result } = await amadeus.shopping.hotelOffersByHotel.get({
            hotelId,
        });
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

amadeusHotelsRouter.get("/search/hotel-offers/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { result } = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: id,
            ...req.query,
        });
        res.status(200).send(result);
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
