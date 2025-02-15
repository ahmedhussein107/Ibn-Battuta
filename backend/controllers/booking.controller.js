import Booking from "../models/booking.model.js";
import Activity from "../models/activity.model.js";
import Itinary from "../models/itinerary.model.js";
import Tourist from "../models/tourist.model.js";
import { getFreeSpotsHelper } from "./itinerary.controller.js";
import { Query } from "mongoose";
import path from "path";
import sendEmail from "../utilities/emailUtils.js";
export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            res.status(200).json(booking);
        } else {
            res.status(404).json({ message: "Booking not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (booking) {
            res.status(200).json(booking);
        } else {
            res.status(404).json({ message: "Booking not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createBooking = async (req, res) => {
    try {
        let totprice = 0;
        const { typeId, bookingType, count } = req.body;
        console.log("req.body", req.body);
        const touristID = req.user.userId;
        const tourist = await Tourist.findById(touristID);
        let date = new Date();
        if (bookingType === "Itinerary") {
            const itinerary = await Itinary.findById(typeId);
            date = itinerary.startDate;
            if (itinerary.isActivated === false) {
                return res
                    .status(400)
                    .json({ message: "The itinerary is not open for booking" });
            }
            // loop over activities in this itinerary
            const mn = await getFreeSpotsHelper(itinerary._id);
            if (mn < req.body.count) {
                return res.status(400).json({ message: "Not enough free spots" });
            }
            totprice = itinerary.price * count;
            for (const object of itinerary.activities) {
                if (object.activityType === "Activity") {
                    const activityInfo = await Activity.findById(object.activity);
                    activityInfo.freeSpots = activityInfo.freeSpots - count;
                    await activityInfo.save();
                    await Booking.create({
                        touristID,
                        bookingType: "Activity",
                        typeId: object.activity,
                        count,
                        totalPrice: itinerary.price * count,
                        pointsAdded: 0,
                        isInItinerary: true,
                        eventStartDate: object.startDate,
                    });
                } else if (object.activityType === "CustomActivity") {
                    // Handle CustomActivity if needed
                }
            }
        } else {
            const activity = await Activity.findById(typeId);
            date = activity.startDate;
            if (activity.isOpenForBooking === false) {
                return res
                    .status(400)
                    .json({ message: "The activity is not open for booking" });
            }
            activity.freeSpots = activity.freeSpots - count;
            totprice = activity.price * count;
            totprice -= totprice * (activity.specialDiscount / 100.0);
            await activity.save();
        }

        let pointsAdded = 0;
        if (tourist.points <= 100000) {
            pointsAdded = 0.5 * totprice;
        } else if (tourist.points <= 500000) {
            pointsAdded = totprice;
        } else {
            pointsAdded = totprice * 1.5;
        }

        const booking = await Booking.create({
            touristID,
            ...req.body,
            totalPrice: totprice,
            pointsAdded,
            eventStartDate: date,
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const completeBooking = async (req, res) => {
    const { id } = req.params;
    const { amountFromWallet } = req.body;
    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.isComplete) {
            return res.status(400).json({ message: "The booking is already completed" });
        }
        booking.isComplete = true;
        const tourist = await Tourist.findById(booking.touristID);
        sendEmail(
            tourist.email,
            "Booking Completed",
            `Your booking has been completed successfully\n You have paid ${booking.totalPrice} EGP`
        );
        tourist.points += booking.pointsAdded;
        tourist.loyalityPoints += booking.pointsAdded;
        tourist.wallet = Math.max(0, tourist.wallet - amountFromWallet);
        await tourist.save();
        await booking.save();
        res.cookie("balance", tourist.wallet)
            .status(200)
            .json({ message: "Booking completed successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const currentDate = new Date(Date.now());
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(400).json({ message: "The booking does not exist" });
        }
        const { touristID, isInItinerary } = booking;
        let date;
        //here I will determine the date
        if (booking.bookingType === "Itinerary") {
            const itinerary = await Itinary.findById(booking.typeId);
            date = new Date(itinerary.startDate);
        } else {
            const activity = await Activity.findById(booking.typeId);
            date = new Date(activity.startDate);
        }

        if (booking.isComplete) {
            const givenDate = new Date(date);
            const differenceInMilliseconds = givenDate - currentDate;
            const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24.0);
            if (differenceInDays < 2) {
                return res.status(400).json({ message: "The booking cannot be deleted" });
            }
        }

        // I want to delete all points got from this booking from the tourist
        const tourist = await Tourist.findById(booking.touristID);
        if (booking.bookingType === "Itinerary") {
            const itinerary = await Itinary.findById(booking.typeId);
            // I want to loop over activites in this itinerary and increase their freeSpots
            for (const object of itinerary.activities) {
                if (object.activityType === "Activity") {
                    const activityInfo = await Activity.findById(object.activity);
                    activityInfo.freeSpots = activityInfo.freeSpots + booking.count;
                    await activityInfo.save();
                    const activityBooking = await Booking.findOneAndDelete({
                        touristID,
                        bookingType: "Activity",
                        typeId: object.activity,
                        isInItinerary: true,
                    });
                } else if (object.activityType === "CustomActivity") {
                    // Handle CustomActivity if needed
                }
            }
        } else {
            // I want to add the spots taken from the activity or the Itinerary
            const activity = await Activity.findById(booking.typeId);
            activity.freeSpots += booking.count;
            await activity.save();
        }

        if (booking.isComplete) {
            // I want also to add amount to the wallet of the tourist
            tourist.wallet += booking.totalPrice;
            tourist.loyalityPoints -= booking.pointsAdded;
            tourist.points -= booking.pointsAdded;
            await tourist.save();
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteBookings = async (req, res) => {
    try {
        await Booking.deleteMany({});
        res.status(200).json({ message: "All bookings deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const redeemPoints = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const tourist = await Tourist.findById(booking.touristID);
        if (tourist.loyalityPoints === 0) {
            return res.status(400).json({ message: "you don't have any points" });
        }
        tourist.wallet += tourist.loyalityPoints / 100.0;
        tourist.loyalityPoints = 0;
        await tourist.save();
        res.status(200).json({ message: "points redeemed successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// get bookings by tourist id
export const getitineraryBookings = async (req, res) => {
	try {
		const id = req.user.userId;
		const page = Math.max(1, parseInt(req.query.page) || 1);
		const limit = Math.max(1, parseInt(req.query.limit) || 10);
		const toSkip = (page - 1) * limit;
		// const count = await Booking.countDocuments({
		//     touristID: id,
		//     bookingType: "Itinerary",
		// });
		const filter = req.query.filter;
		let query = {
			touristID: id,
			bookingType: "Itinerary",
		};
		if (filter === "Upcoming") {
			query.eventStartDate = { $gte: new Date() };
		} else if (filter === "Past") {
			query.eventStartDate = { $lt: new Date() };
		}
		const count = await Booking.countDocuments(query);
		const bookings = await Booking.find(query)
			.sort({ createdAt: -1 })
			.skip(toSkip)
			.limit(limit)
			.populate({
				path: "typeId",
				populate: {
					path: "tourguideID",
					model: "TourGuide",
				},
			})
			.populate({
				path: "ratingID",
				model: "Rating",
			})
			.populate({
				path: "ratingTourGuideID",
				model: "Rating",
			});
		console.log(bookings, "BOOKINGS");
		res.status(200).json({
			result: bookings,
			totalPages: count > 0 ? Math.ceil(count / limit) : 1,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getActivityBookings = async (req, res) => {
	try {
		const id = req.user.userId;
		const page = Math.max(1, parseInt(req.query.page) || 1);
		const limit = Math.max(1, parseInt(req.query.limit) || 10);
		const toSkip = (page - 1) * limit;
		const filter = req.query.filter;
		let query = {
			touristID: id,
			bookingType: "Activity",
			isInItinerary: false,
		};
		if (filter === "Upcoming") {
			console.log("here at upcoming");
			query.eventStartDate = { $gte: new Date() };
		} else if (filter === "Past") {
			console.log("here at past");
			query.eventStartDate = { $lt: new Date() };
		}
		const count = await Booking.countDocuments(query);
		const bookings = await Booking.find(query)
			.sort({ createdAt: -1 }) // Sort by createdAt in descending order
			.skip(toSkip)
			.limit(limit)
			.populate({
				path: "typeId",
				populate: {
					path: "advertiserID",
					model: "Advertiser",
				},
			})
			.populate({
				path: "ratingID",
				model: "Rating",
			});
		res.status(200).json({
			result: bookings,
			totalPages: count > 0 ? Math.ceil(count / limit) : 1,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getHotelBookings = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const toSkip = (page - 1) * limit;
        const filter = req.query.filter;

		const touristId = req.user.userId;
		const tourist = await Tourist.findById(touristId);
		if (!tourist) {
			return res.status(404).json({ error: "Tourist not found" });
		}
		let bookings = [];
		if (filter === "Past") {
			bookings = tourist.hotelBookings.filter(
				(booking) => new Date(booking.checkInDate) < new Date()
			);
		} else if (filter === "Upcoming") {
			bookings = tourist.hotelBookings.filter(
				(booking) => new Date(booking.checkInDate) >= new Date()
			);
		} else {
			bookings = tourist.hotelBookings;
		}
		bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		const total = bookings.length;
		const bookingsSlice = total > 0 ? bookings.slice(toSkip, toSkip + limit) : [];

        res.status(200).json({
            result: bookingsSlice,
            totalPages: total > 0 ? Math.ceil(total / limit) : 1,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getFlightBookings = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const toSkip = (page - 1) * limit;
        const filter = req.query.filter;

        const touristId = req.user.userId;
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            return res.status(404).json({ error: "Tourist not found" });
        }

        let bookings = [];

		if (filter === "Past") {
			bookings = tourist.flightBookings.filter(
				(booking) =>
					new Date(booking.flightOffers[0].itineraries[0].segments[0].departure.at) <
					new Date()
			);
		} else if (filter === "Upcoming") {
			bookings = tourist.flightBookings.filter((booking) =>
				booking.flightOffers[0].itineraries.length === 1
					? new Date(booking.flightOffers[0].itineraries[0].segments[0].departure.at) >=
					  new Date()
					: new Date(booking.flightOffers[0].itineraries[1].segments[0].departure.at) >=
					  new Date()
			);
		} else {
			bookings = tourist.flightBookings;
			console.log(
				"HEYYYYYYYYYYYYYY",
				bookings[0].flightOffers[0].itineraries[0].segments[0].departure.at
			);
		}

		// Sort bookings by createdAt in descending order
		bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		
		const total = bookings.length;
		const bookingsSlice = total > 0 ? bookings.slice(toSkip, toSkip + limit) : [];

        res.status(200).json({
            result: bookingsSlice,
            totalPages: total > 0 ? Math.ceil(total / limit) : 1,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const checkPossiblePackageFlight = async (req, res) => {
    try {
        const tourist = await Tourist.findById(req.user.userId);
        const flight = tourist.flightBookings.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )[0].flightOffers[0];
        const hotels = tourist.hotelBookings.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        console.log("hotels", hotels);
        for (const hotel of hotels) {
            const result =
                new Date(hotel.checkInDate).getTime() -
                new Date(flight.departureDate).getTime();
            console.log(
                "result",
                result,
                new Date(hotel.checkInDate),
                flight.departureDate
            );
            if (
                new Date(hotel.checkInDate).getTime() -
                    new Date(flight.departureDate).getTime() <=
                    2 * 86400000 &&
                hotel.chosenCity.name === flight.arrivalCity
            ) {
                console.log("I am here", hotel);
                hotel.currency = tourist.currency;
                return res.status(200).json({ hotel });
            }
        }
        res.status(200).json({});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const checkPossiblePackageHotel = async (req, res) => {
    try {
        const tourist = await Tourist.findById(req.user.userId);
        const flights = tourist.flightBookings.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        const hotel = tourist.hotelBookings.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )[0];
        for (const flight of flights) {
            const result =
                new Date(hotel.checkInDate).getTime() -
                new Date(flight.flightOffers[0].departureDate).getTime();
            console.log(
                "result",
                result,
                new Date(hotel.checkInDate),
                flight.flightOffers[0].departureDate
            );
            if (
                new Date(hotel.checkInDate).getTime() -
                    new Date(flight.flightOffers[0].departureDate).getTime() <=
                    2 * 86400000 &&
                hotel?.chosenCity?.name === flight.flightOffers[0].arrivalCity
            ) {
                console.log("I am here", hotel);
                hotel.currency = tourist.currency;
                return res.status(200).json({ hotel });
            }
        }
        res.status(200).json({});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
