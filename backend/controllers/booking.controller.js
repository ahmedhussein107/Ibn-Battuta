import Booking from "../models/booking.model.js";
import Activity from "../models/activity.model.js";
import Itinary from "../models/itinerary.model.js";
import Tourist from "../models/tourist.model.js";
export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const createBooking = async (req, res) => {
    try {
        // The Logic here is to buy with wallet only
        let totprice = 0;
        const tourist = await Tourist.findById(req.body.touristID);
        if (req.body.bookingType === "Itinerary") {
            const itinerary = await Itinary.findById(req.body.typeId);
            if (itinerary.isActivated === false) {
                return res
                    .status(400)
                    .json({ message: "The itinerary is not open for booking" });
            }
            if (itinerary.freeSpots - req.body.count < 0) {
                return res.status(400).json({ message: "there is no free spaces" });
            }
            itinerary.freeSpots = itinerary.freeSpots - req.body.count;
            totprice = itinerary.price * req.body.count;
            if (tourist.wallet < totprice) {
                return res.status(400).json({ message: "your balance is not enough" });
            }
            await itinerary.save();
        } else {
            const activity = await Activity.findById(req.body.typeId);
            if (activity.isOpenForBooking === false) {
                return res
                    .status(400)
                    .json({ message: "The activity is not open for booking" });
            }
            if (activity.freeSpots - req.body.count < 0) {
                return res.status(400).json({ message: "there is no free spaces" });
            }

            activity.freeSpots = activity.freeSpots - req.body.count;
            totprice = activity.price * req.body.count;
            totprice -= totprice * (activity.specialDiscount / 100.0);
            if (tourist.wallet < totprice) {
                return res.status(400).json({ message: "your balance is not enough" });
            }
            await activity.save();
        }

        tourist.wallet = tourist.wallet - totprice;
        if (tourist.points <= 100000) {
            tourist.loyalityPoints += totprice * 0.5;
            tourist.points += totprice * 0.5;
        } else if (tourist.points <= 500000) {
            tourist.loyalityPoints += totprice;
            tourist.points += totprice;
        } else {
            tourist.loyalityPoints += totprice * 1.5;
            tourist.points += totprice * 1.5;
        }
        await tourist.save();
        const booking = await Booking.create(req.body);
        res.status(201).json(booking);
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
            let totprice = 0;
            if (booking.bookingType === "Itinerary") {
                const itinerary = await Itinary.findById(booking.typeId);
                itinerary.freeSpots += booking.count;
                totprice = itinerary.price * booking.count;
                await itinerary.save();
            } else {
                const activity = await Activity.findById(booking.typeId);
                activity.freeSpots += booking.count;
                totprice = activity.price * booking.count;

                totprice -= totprice * (activity.specialDiscount / 100.0);
                await activity.save();
            }
            // there is a small problem here but it's not a big problem , pingow
            if (tourist.points <= 100000) {
                tourist.loyalityPoints -= totprice * 0.5;
                tourist.points -= totprice * 0.5;
            } else if (tourist.points <= 500000) {
                tourist.loyalityPoints -= totprice;
                tourist.points -= totprice;
            } else {
                tourist.loyalityPoints -= totprice * 1.5;
                tourist.points -= totprice * 1.5;
            }

            // I want to add the spots taken from the activity or the Itinerary

            // I want also to add amount to the wallet of the tourist
            tourist.wallet += totprice;

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
