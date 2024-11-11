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
            hotelIds: hotelIds?.[0],
            checkInDate: start,
            checkOutDate: end,
            adults: guests,
        });
        resposne = [];
        console.log("result is", result);
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
        console.log("response is", response);
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

import http from "https";

const api_key = "13f30476a7msh7c7b0bf653e92d8p1ad710jsn75d88c3a6625";

// function getHotelRoomList(query, callback) {
//     const options = {
//         method: "GET",
//         hostname: "booking-com.p.rapidapi.com",
//         port: null,
//         path: `/v1/hotels/room-list?checkin_date=${query.checkIn}&children_ages=5%2C0%2C9&adults_number_by_rooms=${query.guests}%2C1&currency=AED&units=metric&children_number_by_rooms=2%2C1&checkout_date=${checkOut}&hotel_id=${hotelId}&locale=en-gb`,
//         headers: {
//             "x-rapidapi-key": api_key, // Use your actual API key here
//             "x-rapidapi-host": "booking-com.p.rapidapi.com",
//         },
//     };

//     const req = http.request(options, function (res) {
//         const chunks = [];

//         res.on("data", function (chunk) {
//             chunks.push(chunk);
//         });

//         res.on("end", function () {
//             const body = Buffer.concat(chunks).toString();
//             try {
//                 const parsedData = JSON.parse(body);

//                 if (parsedData && parsedData.result) {
//                     // do the work;
//                     const offers = parsedData.result.rooms.map((room) => ({
//                         roomType: room.room_type,
//                         price: room.price.total_price,
//                         amenities: room.amenities,
//                         currency: room.price.currency,
//                     }));

//                     // Call the callback function with the rooms data
//                     callback(null, offers);
//                 } else {
//                     callback(new Error("No rooms found or invalid data"));
//                 }
//             } catch (err) {
//                 callback(new Error("Error parsing API response: " + err.message));
//             }
//         });
//     });

//     req.on("error", function (err) {
//         callback(new Error("API request failed: " + err.message));
//     });

//     req.end();
// }

// app.get("/api/hotel/rooms", async (req, res) => {
//     const { hotelIds } = req.query;
//     const query = {};
//     query.checkIn = req.query.checkIn;
//     query.checkOut = req.query.checkOut;
//     query.guests = req.query.guests;

//     if (!hotelIds) {
//         return res.status(400).json({ error: "Hotel IDs are required" });
//     }

//     const hotelIdList = hotelIds.split(",");

//     try {
//         const roomLists = [];

//         for (let hotelId of hotelIdList) {
//             query.hotelId = hotelId;
//             const rooms = await new Promise((resolve, reject) => {
//                 getHotelRoomList(hotelId, (err, rooms) => {
//                     if (err) {
//                         return reject(err);
//                     }
//                     resolve(rooms);
//                 });
//             });
//             roomLists.push({ query, rooms });
//         }

//         // Return the combined result
//         res.json({ roomLists });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

const getHotelsByCoordinates = (query, callback) => {
    const options = {
        method: "GET",
        hostname: "booking-com.p.rapidapi.com",
        port: null,
        path: `/v1/hotels/search-by-coordinates?adults_number=2&checkin_date=${query.checkIn}&children_number=2&locale=en-gb&room_number=1&units=metric&filter_by_currency=USD&longitude=${query.lng}&children_ages=5%2C0&checkout_date=${query.checkOut}&latitude=${query.lat}&order_by=popularity&include_adjacency=true&page_number=0&categories_filter_ids=class%3A%3A2%2Cclass%3A%3A4%2Cfree_cancellation%3A%3A1`,
        headers: {
            "x-rapidapi-key": api_key,
            "x-rapidapi-host": "booking-com.p.rapidapi.com",
        },
    };

    const req = http.request(options, (res) => {
        const chunks = [];

        res.on("data", (chunk) => {
            chunks.push(chunk);
        });

        res.on("end", () => {
            const body = Buffer.concat(chunks);
            callback(null, JSON.parse(body.toString()));
        });
    });

    req.on("error", (error) => {
        callback(error, null);
    });

    req.end();
};

const getHotelsByCoordinatesHandler = (req, res) => {
    const lat = req.query.lat || 25.2048;
    const lng = req.query.lng || 55.2708;
    const checkIn = req.query.checkIn || new Date().toISOString().split("T")[0];
    const checkOut =
        req.query.checkOut ||
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const query = { lat, lng, checkIn, checkOut };

    getHotelsByCoordinates(query, (err, hotels) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({ hotels });
    });
};

export default amadeusHotelsRouter;
