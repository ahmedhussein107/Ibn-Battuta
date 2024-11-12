import Booking from "../models/booking.model.js";
import Activity from "../models/activity.model.js";
import Itinary from "../models/itinerary.model.js";
import Tourist from "../models/tourist.model.js";
import { getFreeSpotsHelper } from "./itinerary.controller.js";
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
		// The Logic here is to buy with wallet only
		let totprice = 0;
		const { typeId, bookingType, count } = req.body;
		const touristID = req.user.userId;
		const tourist = await Tourist.findById(touristID);
		if (bookingType === "Itinerary") {
			const itinerary = await Itinary.findById(typeId);
			if (itinerary.isActivated === false) {
				return res.status(400).json({ message: "The itinerary is not open for booking" });
			}
			// loop over activities in this itinerary
			const mn = await getFreeSpotsHelper(itinerary._id);
			console.log(mn);
			if (mn < req.body.count) {
				return res.status(400).json({ message: "Not enough free spots" });
			}
			totprice = itinerary.price * count;
			if (tourist.wallet < totprice) {
				return res.status(400).json({ message: "your balance is not enough" });
			}
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
					});
				} else if (object.activityType === "CustomActivity") {
					// Handle CustomActivity if needed
				}
			}
		} else {
			const activity = await Activity.findById(typeId);
			if (activity.isOpenForBooking === false) {
				return res.status(400).json({ message: "The activity is not open for booking" });
			}
			activity.freeSpots = activity.freeSpots - count;
			totprice = activity.price * count;
			totprice -= totprice * (activity.specialDiscount / 100.0);
			if (tourist.wallet < totprice) {
				return res.status(400).json({ message: "your balance is not enough" });
			}
			await activity.save();
		}

		tourist.wallet = tourist.wallet - totprice;
		let pointsAdded = 0;
		if (tourist.points <= 100000) {
			pointsAdded = 0.5 * totprice;
		} else if (tourist.points <= 500000) {
			pointsAdded = totprice;
		} else {
			pointsAdded = totprice * 1.5;
		}
		tourist.loyalityPoints += pointsAdded;
		tourist.points += pointsAdded;
		await tourist.save();
		const booking = await Booking.create({
			touristID,
			...req.body,
			totalPrice: totprice,
			pointsAdded,
		});
		res.status(201).json(booking);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteBooking = async (req, res) => {
	try {
		const currentDate = new Date(Date.now());
		const booking = await Booking.findById(req.params.id);
		const { touristID, isInItinerary } = booking;
		if (!booking) {
			return res.status(400).json({ message: "The booking does not exist" });
		}
		let date;
		//here I will determine the date
		if (booking.bookingType === "Itinerary") {
			const itinerary = await Itinary.findById(booking.typeId);
			date = new Date(itinerary.startDate);
		} else {
			const activity = await Activity.findById(booking.typeId);
			date = new Date(activity.startDate);
		}
		const givenDate = new Date(date);
		const differenceInMilliseconds = givenDate - currentDate;
		const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24.0);
		if (differenceInDays < 2) {
			return res.status(400).json({ message: "The booking cannot be deleted" });
		} else {
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
				const activity = await Activity.findById(booking.typeId);
				activity.freeSpots += booking.count;
				await activity.save();
			}

			// I want to add the spots taken from the activity or the Itinerary

			// I want also to add amount to the wallet of the tourist
			tourist.wallet += booking.totalPrice;
			tourist.loyalityPoints -= booking.pointsAdded;
			tourist.points -= booking.pointsAdded;
			await tourist.save();
			// return res.status(200).json({ message: "ahmed was here" });
		}

		if (!booking) {
			return res.status(404).json({ message: "Booking not found" });
		}
		await Booking.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Booking deleted successfully" });
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
		const count = await Booking.countDocuments({
			touristID: id,
			bookingType: "Itinerary",
		});
		const bookings = await Booking.find({
			touristID: id,
			bookingType: "Itinerary",
		})
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
			});
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
		const count = await Booking.countDocuments({
			touristID: id,
			bookingType: "Activity",
			isInItinerary: false,
		});
		const bookings = await Booking.find({
			touristID: id,
			bookingType: "Activity",
			isInItinerary: false,
		})
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

		const touristId = req.user.userId;
		const tourist = await Tourist.findById(touristId);
		if (!tourist) {
			return res.status(404).json({ error: "Tourist not found" });
		}
		const total = tourist.hotelBookings.length;
		const bookingsSlice = total > 0 ? tourist.hotelBookings.slice(toSkip, toSkip + limit) : [];

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

		const touristId = req.user.userId;
		const tourist = await Tourist.findById(touristId);
		if (!tourist) {
			return res.status(404).json({ error: "Tourist not found" });
		}
		const total = tourist.flightBookings.length;
		const bookingsSlice = total > 0 ? tourist.flightBookings.slice(toSkip, toSkip + limit) : [];

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
		for (const hotel of hotels) {
			const result =
				new Date(hotel.checkInDate).getTime() - new Date(flight.departureDate).getTime();
			console.log("result", result, new Date(hotel.checkInDate), flight.departureDate);
			if (
				new Date(hotel.checkInDate).getTime() - new Date(flight.departureDate).getTime() <=
					2 * 86400000 &&
				hotel.chosenCity.name === flight.arrivalCity
			) {
				console.log("I am here", hotel);
				hotel.currency = tourist.currency;
				return res.status(200).json({ hotel });
			}
		}
		res.status(200).json({});
	} catch {
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
				hotel.chosenCity.name === flight.flightOffers[0].arrivalCity
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
